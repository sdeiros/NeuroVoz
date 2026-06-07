// @ts-nocheck
import type { Activity } from './store';

/** 'HH:MM' → minutos do dia. */
export function timeToMinutes(t?: string): number | null {
  if (!t) return null;
  const [h, m] = String(t).split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/** 'HH:MM' → timestamp HOJE. */
export function timeToMs(t?: string): number | null {
  const mins = timeToMinutes(t);
  if (mins === null) return null;
  const d = new Date();
  d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  return d.getTime();
}

export function startMs(a: Activity) { return timeToMs(a.timeStart); }
export function endMs(a: Activity)   { return timeToMs(a.timeEnd); }

/** Cronômetro HH:MM:SS até `target`. */
export function formatClock(target: number | null): string {
  if (target === null) return '--:--:--';
  const diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Linguagem natural: "Faltam 2 horas e 15 minutos". */
export function formatHuman(target: number | null, prefix = 'Faltam'): string {
  if (target === null) return 'Horário livre';
  const diffSec = Math.floor((target - Date.now()) / 1000);
  if (diffSec <= 0) return 'Horário atingido';
  if (diffSec < 60) return 'Menos de 1 minuto restante';
  const totalMin = Math.round(diffSec / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const hh = h ? `${h} ${h === 1 ? 'hora' : 'horas'}` : '';
  const mm = m ? `${m} ${m === 1 ? 'minuto' : 'minutos'}` : '';
  if (h && m) return `${prefix} ${hh} e ${mm}`;
  return `${prefix} ${hh || mm}`;
}

/** Mensagem contextual amigável conforme estado. */
export function contextualMessage(a: Activity | null): string {
  if (!a) return 'Seu dia está livre.';
  if (a.completed) return `✅ ${a.name} concluída`;
  const s = startMs(a);
  const e = endMs(a);
  const now = Date.now();
  if (s !== null && now < s) {
    const min = Math.round((s - now) / 60000);
    if (min <= 5) return `${a.icon || '⏳'} ${a.name} começa em ${min || '<1'} min`;
    return `${a.icon || '⏳'} ${formatHuman(s)} para ${a.name}`;
  }
  if (s !== null && e !== null && now >= s && now <= e) {
    return `${a.icon || '⏳'} ${formatHuman(e, 'Restam')} de ${a.name}`;
  }
  if (e !== null && now > e) return `${a.icon || '⌛'} ${a.name} excedeu o tempo`;
  return `${a.icon || '📍'} Hora da atividade: ${a.name}`;
}

/** Progresso 0–1: tempo decorrido se houver start/end, senão % tarefas. */
export function progressOf(a: Activity | null): number {
  if (!a) return 0;
  if (a.completed) return 1;
  const s = startMs(a); const e = endMs(a);
  if (s !== null && e !== null && e > s) {
    return Math.max(0, Math.min(1, (Date.now() - s) / (e - s)));
  }
  const tasks = a.tasks || [];
  if (tasks.length) return tasks.filter((t) => t.done).length / tasks.length;
  return 0;
}

/** 'urgent' (≤1min) | 'soon' (≤5min) | 'normal' */
export function urgencyOf(a: Activity | null): 'urgent' | 'soon' | 'normal' {
  if (!a) return 'normal';
  const s = startMs(a);
  if (s === null) return 'normal';
  const diffMin = (s - Date.now()) / 60000;
  if (diffMin <= 1 && diffMin > -1) return 'urgent';
  if (diffMin <= 5 && diffMin > 0) return 'soon';
  return 'normal';
}

export function formatGreeting(): string {
  const h = new Date().getHours();
  if (h < 6)  return 'Boa madrugada!';
  if (h < 12) return 'Bom dia!';
  if (h < 18) return 'Boa tarde!';
  return 'Boa noite!';
}

export function formatDateLong(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long',
  });
}
