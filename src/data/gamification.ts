// @ts-nocheck
import { loadGamification, saveGamification, todayKey, pushHistory, type Activity } from './store';
import { chime, vibrate, speak } from './notifications';

const ACHIEVEMENTS: { id: string; label: string; emoji: string; check: (g: ReturnType<typeof loadGamification>) => boolean }[] = [
  { id: 'first',     label: 'Primeira conquista', emoji: '🌱', check: (g) => g.points >= 10 },
  { id: 'p50',       label: '50 pontos!',         emoji: '⭐', check: (g) => g.points >= 50 },
  { id: 'p100',      label: '100 pontos!',        emoji: '🏆', check: (g) => g.points >= 100 },
  { id: 'streak3',   label: 'Sequência de 3 dias',emoji: '🔥', check: (g) => g.streak >= 3 },
  { id: 'streak7',   label: 'Sequência de 7 dias',emoji: '👑', check: (g) => g.streak >= 7 },
];

export function awardForCompletion(a: Activity, extra = 0) {
  const g = loadGamification();
  const today = todayKey();
  if (g.lastDay !== today) {
    // streak: ontem?
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    g.streak = g.lastDay === yesterday ? g.streak + 1 : 1;
    g.lastDay = today;
  }
  const base = 10;
  const taskBonus = (a.tasks || []).filter((t) => t.done).length * 2;
  const gain = base + taskBonus + extra;
  g.points += gain;
  const newOnes: string[] = [];
  ACHIEVEMENTS.forEach((ach) => {
    if (!g.achievements.includes(ach.id) && ach.check(g)) {
      g.achievements.push(ach.id);
      newOnes.push(`${ach.emoji} ${ach.label}`);
    }
  });
  saveGamification(g);

  pushHistory({
    id: a.id, name: a.name, icon: a.icon, color: a.color,
    time: a.timeStart,
    completedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    date: today, type: 'completed',
    tasksDone: (a.tasks || []).filter((t) => t.done).length,
    tasksTotal: (a.tasks || []).length,
  });

  celebrate(gain, newOnes);
  return { gain, newOnes };
}

export function listAchievements() {
  const g = loadGamification();
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: g.achievements.includes(a.id) }));
}

// ─── Celebração visual (confete + toast) ───────────────────────────────────

function celebrate(points: number, newAchievements: string[]) {
  const layer = document.getElementById('nv-celebration-layer');
  if (!layer) return;
  const COLORS = ['#5b8def', '#f5a623', '#2fbf71', '#e0457b', '#9b59b6', '#1abc9c'];
  const count = 60;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'nv-confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = COLORS[i % COLORS.length];
    piece.style.animationDelay = Math.random() * 0.3 + 's';
    piece.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
  toast(`⭐ +${points} pontos`, 'success');
  newAchievements.forEach((label, i) => setTimeout(() => toast(`🏆 ${label}`, 'achievement'), 600 * (i + 1)));
  chime('success');
  vibrate([80, 60, 120]);
  speak(`Muito bem! Você ganhou ${points} pontos.`);
}

export function toast(msg: string, kind: 'success' | 'achievement' | 'info' = 'info') {
  const layer = document.getElementById('nv-celebration-layer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = `nv-toast nv-toast--${kind}`;
  el.setAttribute('role', 'status');
  el.textContent = msg;
  layer.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  setTimeout(() => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 400); }, 2800);
}
