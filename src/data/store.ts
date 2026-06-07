// @ts-nocheck
/**
 * Camada única de persistência do módulo de Rotina.
 * — Sem pontos, XP, streaks ou recompensas numéricas. —
 * Histórico e celebrações visuais são mantidos como feedback positivo.
 */

export const KEYS = {
  PLAN: 'nv-routine-plan',
  HISTORY: 'nv-routine-history',
  SETTINGS: 'nv-routine-settings',
} as const;

export const EVENT = 'nv-routine-updated';

export type Task = { id: string; label: string; done: boolean };

export type Activity = {
  id: string;
  name: string;
  icon: string;
  /** Categoria visual (estudo, arte, …). A cor é derivada automaticamente. */
  category?: string;
  /** Legado: ignorado pelo render (cor vem da categoria). Mantido para retro-compat. */
  color?: string;
  timeStart?: string;
  timeEnd?: string;
  countdown?: number;
  alarm?: boolean;
  notes?: string;
  tasks?: Task[];
  completed?: boolean;
  completedAt?: string;
  countdownFired?: boolean;
  alarmFired?: boolean;
};

export type HistoryEntry = {
  id: string;
  name: string;
  icon: string;
  color?: string;
  time?: string;
  completedAt: string;        // 'HH:MM'
  date: string;               // 'YYYY-MM-DD'
  type: 'completed' | 'alarm' | 'countdown';
  label?: string;
  durationMin?: number;
  tasksDone?: number;
  tasksTotal?: number;
};

export type Settings = {
  hidden: boolean;
  sound: boolean;
  voice: boolean;
  vibrate: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  hidden: false, sound: false, voice: true, vibrate: true,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function emitUpdate() {
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── PLAN ──────────────────────────────────────────────────────────────────

export function loadPlan(): { day: string; activities: Activity[] } {
  const plan = read<{ day: string; activities: Activity[] } | null>(KEYS.PLAN, null);
  if (!plan || plan.day !== todayKey() || !Array.isArray(plan.activities)) {
    return { day: todayKey(), activities: [] };
  }
  return plan;
}

export function savePlan(activities: Activity[]) {
  write(KEYS.PLAN, { day: todayKey(), activities });
  emitUpdate();
}

export function addActivity(act: Omit<Activity, 'id'>) {
  const plan = loadPlan();
  const activity: Activity = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tasks: [], ...act,
  };
  plan.activities.push(activity);
  savePlan(plan.activities);
  return activity;
}

export function updateActivity(id: string, patch: Partial<Activity>) {
  const plan = loadPlan();
  const idx = plan.activities.findIndex((a) => a.id === id);
  if (idx < 0) return;
  plan.activities[idx] = { ...plan.activities[idx], ...patch };
  savePlan(plan.activities);
}

export function removeActivity(id: string) {
  const plan = loadPlan();
  savePlan(plan.activities.filter((a) => a.id !== id));
}

export function toggleTask(activityId: string, taskId: string) {
  const plan = loadPlan();
  const act = plan.activities.find((a) => a.id === activityId);
  if (!act?.tasks) return;
  const t = act.tasks.find((x) => x.id === taskId);
  if (!t) return;
  t.done = !t.done;
  savePlan(plan.activities);
}

// ─── HISTORY ───────────────────────────────────────────────────────────────

export function loadHistory(): HistoryEntry[] {
  return read<HistoryEntry[]>(KEYS.HISTORY, []);
}

export function pushHistory(entry: HistoryEntry) {
  const all = loadHistory();
  all.unshift(entry);
  write(KEYS.HISTORY, all.slice(0, 240));
  emitUpdate();
}

export function clearHistory() {
  write(KEYS.HISTORY, []);
  emitUpdate();
}

// ─── SETTINGS ──────────────────────────────────────────────────────────────

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(KEYS.SETTINGS, {}) };
}

export function saveSettings(patch: Partial<Settings>) {
  write(KEYS.SETTINGS, { ...loadSettings(), ...patch });
  emitUpdate();
}
