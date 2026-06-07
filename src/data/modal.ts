// @ts-nocheck
import { loadHistory, loadSettings, saveSettings, EVENT } from './store';
import { snapshot } from './widget';
import { contextualMessage, formatClock, progressOf, startMs } from './time';
import { colorForActivity } from './categories';

type Tab = 'overview' | 'list' | 'tasks' | 'history' | 'settings';

class ModalController {
  el: HTMLElement | null = null;
  tab: Tab = 'overview';
  open = false;
  lastFocused: HTMLElement | null = null;

  mount() {
    this.el = document.getElementById('nv-routine-modal');
    if (!this.el) return;
    this.bind();
    setInterval(() => { if (this.open) this.renderDynamic(); }, 1000);
  }

  bind() {
    const el = this.el!;
    el.querySelectorAll<HTMLButtonElement>('[data-nv-close]').forEach((b) =>
      b.addEventListener('click', () => this.close())
    );
    el.querySelectorAll<HTMLButtonElement>('[data-nv-tab]').forEach((b) =>
      b.addEventListener('click', () => this.setTab(b.dataset.nvTab as Tab))
    );
    el.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
    window.addEventListener('nv-routine-open-modal', () => this.show());
    window.addEventListener(EVENT, () => { if (this.open) this.render(); });
  }

  show() {
    if (!this.el) return;
    this.lastFocused = document.activeElement as HTMLElement;
    this.el.hidden = false;
    this.el.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => this.el!.classList.add('is-open'));
    this.open = true;
    this.render();
    this.el.querySelector<HTMLElement>('[data-nv-close]')?.focus();
  }

  close() {
    if (!this.el) return;
    this.el.classList.remove('is-open');
    this.open = false;
    setTimeout(() => {
      this.el!.hidden = true;
      this.el!.setAttribute('aria-hidden', 'true');
      this.lastFocused?.focus();
    }, 220);
  }

  setTab(t: Tab) {
    this.tab = t;
    this.el?.querySelectorAll<HTMLButtonElement>('[data-nv-tab]').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.nvTab === t);
    });
    this.el?.querySelectorAll<HTMLElement>('[data-nv-panel]').forEach((p) => {
      p.hidden = p.dataset.nvPanel !== t;
    });
    this.render();
  }

  render() {
    if (!this.el) return;
    this.renderHeader();
    if (this.tab === 'overview')  this.renderOverview();
    if (this.tab === 'list')      this.renderList();
    if (this.tab === 'tasks')     this.renderTasks();
    if (this.tab === 'history')   this.renderHistory();
    if (this.tab === 'settings')  this.renderSettings();
  }

  renderDynamic() {
    if (this.tab === 'overview') this.renderOverview();
  }

  renderHeader() {
    const { current, done, activities } = snapshot();
    this.set('[data-nv-h-icon]', current?.icon || '📍');
    this.set('[data-nv-h-name]', current?.name || 'Sem atividade');
    this.set('[data-nv-h-done]', `${done}/${activities.length} hoje`);
    if (current) this.el!.style.setProperty('--nv-accent', colorForActivity(current));
  }

  renderOverview() {
    const { current, next, done, activities } = snapshot();
    const pane = this.q('[data-nv-panel="overview"]');
    if (!pane) return;
    const pct = current ? Math.round(progressOf(current) * 100) : 0;
    const targetStart = current ? startMs(current) : null;
    const accent = current ? colorForActivity(current) : '#5b8def';
    const nextAccent = next ? colorForActivity(next) : accent;
    pane.innerHTML = `
      <div class="nv-modal-now">
        <div class="nv-modal-now-head" style="--c:${accent}">
          <span class="nv-modal-now-emoji">${current?.icon || '📍'}</span>
          <div>
            <h3>${esc(current?.name || 'Nenhuma atividade ativa')}</h3>
            <p>${esc(contextualMessage(current))}</p>
          </div>
        </div>
        <div class="nv-modal-clock">${formatClock(targetStart)}</div>
        <div class="nv-modal-bar"><span style="width:${pct}%"></span></div>
        ${current ? `
          <div class="nv-modal-actions">
            <button class="nv-btn nv-btn--success" data-nv-action="complete">✓ Concluir</button>
            <button class="nv-btn nv-btn--ghost" data-nv-action="open-page">Abrir rotina</button>
          </div>` : ''}
      </div>
      <div class="nv-modal-next">
        <span class="nv-modal-mini-tag">DEPOIS</span>
        <div class="nv-modal-mini" style="--c:${nextAccent}">
          <span class="nv-modal-mini-emoji">${next?.icon || '⏳'}</span>
          <div>
            <strong>${esc(next?.name || 'Sem próxima atividade')}</strong>
            <small>${esc(contextualMessage(next || null))}</small>
          </div>
        </div>
      </div>
      <div class="nv-modal-counter">${done}/${activities.length} concluídas</div>`;

    pane.querySelector('[data-nv-action="complete"]')?.addEventListener('click', () => {
      if (current) window.dispatchEvent(new CustomEvent('nv-routine-complete', { detail: { id: current.id } }));
    });
    pane.querySelector('[data-nv-action="open-page"]')?.addEventListener('click', () => {
      window.location.href = '/dia';
    });
  }

  renderList() {
    const { activities, current } = snapshot();
    const pane = this.q('[data-nv-panel="list"]')!;
    pane.innerHTML = activities.length ? `
      <ol class="nv-modal-list">${activities.map((a) => `
        <li class="nv-modal-list-item ${a.completed ? 'is-done' : ''} ${a.id === current?.id ? 'is-current' : ''}" style="--c:${colorForActivity(a)}">
          <span class="nv-modal-list-emoji">${a.icon || '📍'}</span>
          <div class="nv-modal-list-text">
            <strong>${esc(a.name)}</strong>
            <small>${a.timeStart ? esc(a.timeStart) : 'Horário livre'}${a.timeEnd ? ' – ' + esc(a.timeEnd) : ''}</small>
          </div>
          ${a.completed ? '<span class="nv-modal-list-badge">✓</span>' : ''}
        </li>`).join('')}</ol>`
      : '<p class="nv-modal-empty">Nenhuma atividade hoje.</p>';
  }

  renderTasks() {
    const { activities } = snapshot();
    const pane = this.q('[data-nv-panel="tasks"]')!;
    const items = activities.flatMap((a) => (a.tasks || []).map((t) => ({ a, t })));
    const pending = items.filter((x) => !x.t.done);
    pane.innerHTML = pending.length ? `
      <ul class="nv-modal-tasks">${pending.map(({ a, t }) => `
        <li>
          <button class="nv-task-check" data-nv-task="${t.id}" data-nv-act="${a.id}" aria-label="Concluir"><span></span></button>
          <div>
            <strong>${esc(t.label)}</strong>
            <small>${a.icon || ''} ${esc(a.name)}</small>
          </div>
        </li>`).join('')}</ul>`
      : '<p class="nv-modal-empty">Sem tarefas pendentes 🌿</p>';
    pane.querySelectorAll<HTMLButtonElement>('[data-nv-task]').forEach((b) => {
      b.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('nv-routine-toggle-task', {
          detail: { activityId: b.dataset.nvAct, taskId: b.dataset.nvTask },
        }));
      });
    });
  }

  renderHistory() {
    const all = loadHistory().slice(0, 60);
    const pane = this.q('[data-nv-panel="history"]')!;
    const completed = all.filter((h) => h.type === 'completed');
    pane.innerHTML = `
      <div class="nv-modal-history-head">
        <span class="nv-rm-eyebrow">Histórico de conquistas</span>
        <small>${completed.length} ${completed.length === 1 ? 'atividade concluída' : 'atividades concluídas'}</small>
      </div>
      ${all.length ? `
        <ul class="nv-modal-history">${all.map((h) => `
          <li>
            <span class="nv-h-emoji">${h.icon || '📍'}</span>
            <div>
              <strong>${esc(h.name)}</strong>
              <small>${esc(h.date)} • ${esc(h.completedAt)} • ${labelFor(h.type)}</small>
            </div>
          </li>`).join('')}</ul>`
        : '<p class="nv-modal-empty">Histórico vazio.</p>'}`;
  }

  renderSettings() {
    const s = loadSettings();
    const pane = this.q('[data-nv-panel="settings"]')!;
    const items: [keyof typeof s, string, string][] = [
      ['voice', 'Voz pt-BR', 'Anúncio falado dos alarmes'],
      ['sound', 'Sons', 'Chime suave em eventos'],
      ['vibrate', 'Vibração', 'Em dispositivos compatíveis'],
      ['hidden', 'Ocultar widget', 'Esconder completamente'],
    ];
    pane.innerHTML = `<ul class="nv-set-list">${items.map(([k, label, desc]) => `
      <li>
        <div><strong>${label}</strong><small>${desc}</small></div>
        <button class="nv-switch ${s[k] ? 'is-on' : ''}" data-nv-set="${k}" aria-pressed="${s[k]}"><span></span></button>
      </li>`).join('')}</ul>`;
    pane.querySelectorAll<HTMLButtonElement>('[data-nv-set]').forEach((b) => {
      b.addEventListener('click', () => {
        const k = b.dataset.nvSet as keyof typeof s;
        saveSettings({ [k]: !s[k] } as any);
      });
    });
  }

  q(sel: string) { return this.el?.querySelector<HTMLElement>(sel) || null; }
  set(sel: string, val: string) { const n = this.q(sel); if (n) n.textContent = val; }
}

function esc(s: any) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]!));
}
function labelFor(t: string) {
  return t === 'completed' ? 'Concluído' : t === 'alarm' ? 'Alarme' : 'Aviso prévio';
}

export const modal = new ModalController();
