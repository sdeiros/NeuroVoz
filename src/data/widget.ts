// @ts-nocheck
import { loadPlan, loadSettings, loadHistory, EVENT, type Activity } from './store';
import { startMs, contextualMessage, progressOf, urgencyOf, formatHuman } from './time';
import { colorForActivity } from './categories';

/**
 * Snapshot da rotina (compartilhado entre widget, modal e página /dia).
 */
export function snapshot() {
  const plan = loadPlan();
  const activities = [...plan.activities].sort((a, b) => {
    const at = startMs(a), bt = startMs(b);
    if (at === null && bt === null) return 0;
    if (at === null) return 1;
    if (bt === null) return -1;
    return at - bt;
  });
  const now = Date.now();
  const timed = activities.filter((a) => startMs(a) !== null);
  const current: Activity | null =
       timed.filter((a) => (startMs(a) as number) <= now && !a.completed).at(-1)
    || activities.find((a) => !a.completed && startMs(a) === null)
    || activities.find((a) => !a.completed)
    || null;
  const next = activities.find((a) => !a.completed && a.id !== current?.id && (startMs(a) ?? Infinity) > now)
            || activities.find((a) => !a.completed && a.id !== current?.id)
            || null;
  const done = activities.filter((a) => a.completed).length;
  const progress = activities.length ? done / activities.length : 0;
  return { activities, current, next, done, progress };
}

class WidgetController {
  el: HTMLElement | null = null;
  body: HTMLElement | null = null;
  expanded = false;

  mount() {
    this.el = document.getElementById('nv-routine-widget');
    if (!this.el) return;
    this.body = this.el.querySelector<HTMLElement>('#nv-rw-body');
    this.bind();
    this.render();
    setInterval(() => this.renderDynamic(), 1000);
  }

  bind() {
    const el = this.el!;
    const toggleBtn = el.querySelector<HTMLButtonElement>('[data-nv-widget-toggle]');
    toggleBtn?.addEventListener('click', () => this.toggle());

    el.querySelector<HTMLButtonElement>('[data-nv-widget-open]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('nv-routine-open-modal'));
    });
    el.querySelector<HTMLButtonElement>('[data-nv-widget-complete]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const { current } = snapshot();
      if (current) window.dispatchEvent(new CustomEvent('nv-routine-complete', { detail: { id: current.id } }));
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.expanded) return;
      if (!el.contains(e.target as Node)) this.collapse();
    });
    // Esc colapsa
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.expanded) this.collapse();
    });

    window.addEventListener(EVENT, () => this.render());
  }

  toggle() { this.expanded ? this.collapse() : this.expand(); }

  expand() {
    if (!this.el || !this.body) return;
    this.expanded = true;
    this.el.classList.add('is-expanded');
    this.body.hidden = false;
    const btn = this.el.querySelector('[data-nv-widget-toggle]');
    btn?.setAttribute('aria-expanded', 'true');
  }

  collapse() {
    if (!this.el || !this.body) return;
    this.expanded = false;
    this.el.classList.remove('is-expanded');
    // Aguarda transição antes de hidden p/ acessibilidade
    setTimeout(() => { if (!this.expanded && this.body) this.body.hidden = true; }, 240);
    const btn = this.el.querySelector('[data-nv-widget-toggle]');
    btn?.setAttribute('aria-expanded', 'false');
  }

  render() {
    if (!this.el) return;
    const settings = loadSettings();
    const { activities, current, next, done } = snapshot();
    if (!activities.length || settings.hidden) {
      this.el.setAttribute('hidden', '');
      return;
    }
    this.el.removeAttribute('hidden');

    const active = current || next || activities[0];
    const accent = colorForActivity(active);
    this.el.style.setProperty('--nv-accent', accent);

    this.set('[data-nv-icon]', active?.icon || '📍');
    this.set('[data-nv-title]', active?.name || 'Plano do Dia');
    this.set('[data-nv-done]', `${done}/${activities.length}`);

    // Linhas expandidas
    this.set('[data-nv-now-name]', current?.name || 'Sem atividade ativa');
    this.set('[data-nv-now-icon]', current?.icon || '📍');
    this.set('[data-nv-next-name]', next?.name || 'Sem próxima');
    this.set('[data-nv-next-icon]', next?.icon || '⏳');
    this.set('[data-nv-next-msg]', next ? contextualMessage(next) : 'Tudo certo por enquanto');

    // Última concluída
    const lastEntry = loadHistory().find((h) => h.type === 'completed');
    const lastRow = this.el.querySelector<HTMLElement>('[data-nv-row="last"]');
    if (lastEntry && lastRow) {
      lastRow.hidden = false;
      this.set('[data-nv-last-icon]', lastEntry.icon || '✅');
      this.set('[data-nv-last-name]', lastEntry.name);
      this.set('[data-nv-last-time]', `${lastEntry.completedAt}`);
    } else if (lastRow) {
      lastRow.hidden = true;
    }

    // Botão concluir só faz sentido se há atividade atual
    const completeBtn = this.el.querySelector<HTMLButtonElement>('[data-nv-widget-complete]');
    if (completeBtn) completeBtn.disabled = !current;

    this.renderDynamic();
  }

  renderDynamic() {
    if (!this.el || this.el.hasAttribute('hidden')) return;
    const { current, next, done, activities, progress } = snapshot();
    const active = current || next;
    if (!active) return;

    this.set('[data-nv-subtitle]', this.expanded
      ? `${done}/${activities.length} concluídas`
      : contextualMessage(active));

    this.set('[data-nv-now-msg]', current ? contextualMessage(current) : 'Aproveite uma pausa 🌿');

    const pctDay = Math.round(progress * 100);
    const fill = this.el.querySelector<HTMLElement>('[data-nv-progress]');
    if (fill) fill.style.width = pctDay + '%';
    this.set('[data-nv-progress-label]', `Progresso do dia · ${pctDay}%`);

    // Anel: progresso da atividade atual
    const pctActive = Math.round(progressOf(active) * 100);
    const ring = this.el.querySelector<SVGCircleElement>('[data-nv-ring]');
    if (ring) {
      const C = 2 * Math.PI * 21;
      ring.style.strokeDasharray = String(C);
      ring.style.strokeDashoffset = String(C * (1 - pctActive / 100));
    }

    this.el.dataset.urgency = urgencyOf(active);
  }

  set(sel: string, val: string) {
    const n = this.el?.querySelector(sel);
    if (n) n.textContent = val;
  }
}

export const widget = new WidgetController();
