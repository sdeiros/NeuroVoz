// @ts-nocheck
import { widget } from './widget';
import { modal } from './modal';
import {
  loadPlan, toggleTask, savePlan, todayKey, EVENT, pushHistory,
} from './store';
import { startMs } from './time';
import { requestPermissions, notify, speak, vibrate, chime } from './notifications';
import { celebrateCompletion } from './feedback';

function completeActivity(id: string) {
  const plan = loadPlan();
  const a = plan.activities.find((x) => x.id === id);
  if (!a || a.completed) return;
  a.completed = true;
  a.completedAt = new Date().toISOString();
  savePlan(plan.activities);
  celebrateCompletion(a);
}

function tickAlarms() {
  const plan = loadPlan();
  if (!plan.activities.length) return;
  const now = Date.now();
  let changed = false;
  plan.activities.forEach((a) => {
    const target = startMs(a);
    if (target === null || a.completed) return;
    const cdMs = Number(a.countdown || 0) * 60_000;
    if (cdMs > 0 && !a.countdownFired && now >= target - cdMs && now < target) {
      a.countdownFired = true; changed = true;
      const min = Math.max(1, Math.round((target - now) / 60_000));
      const label = `Faltam ${min} ${min === 1 ? 'minuto' : 'minutos'} para ${a.name}`;
      speak(label); notify('⏳ Prepare-se', label); chime('soft'); vibrate([40, 30, 40]);
      pushHistory({ id: a.id, name: a.name, icon: a.icon, time: a.timeStart,
        completedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        date: todayKey(), type: 'countdown', label });
    }
    if (a.alarm && !a.alarmFired && now >= target) {
      a.alarmFired = true; changed = true;
      const label = `Hora de ${a.name}`;
      speak(`${a.name}. Vamos começar!`); notify(`${a.icon || '📍'} ${a.name}`, label);
      chime('urgent'); vibrate([80, 60, 120]);
      pushHistory({ id: a.id, name: a.name, icon: a.icon, time: a.timeStart,
        completedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        date: todayKey(), type: 'alarm', label });
    }
  });
  if (changed) savePlan(plan.activities);
}

export function bootstrap() {
  if (typeof window === 'undefined') return;
  if ((window as any).__nvRoutineBooted) return;
  (window as any).__nvRoutineBooted = true;

  requestPermissions();
  widget.mount();
  modal.mount();

  window.addEventListener('nv-routine-complete', (e: any) => {
    const id = e?.detail?.id;
    if (id) completeActivity(id);
  });
  window.addEventListener('nv-routine-toggle-task', (e: any) => {
    const { activityId, taskId } = e.detail || {};
    if (activityId && taskId) toggleTask(activityId, taskId);
  });

  setInterval(tickAlarms, 1000);
  setInterval(() => window.dispatchEvent(new CustomEvent(EVENT)), 60_000);

  // Atalho: Alt+R abre o modal direto
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('nv-routine-open-modal'));
    }
  });
}

bootstrap();
