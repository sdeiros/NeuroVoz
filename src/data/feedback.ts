// @ts-nocheck
/**
 * Feedback positivo — sem pontos, XP ou recompensas numéricas.
 * Apenas celebração visual + voz + histórico.
 */
import { pushHistory, todayKey, type Activity } from './store';
import { chime, vibrate, speak } from './notifications';
import { colorForActivity } from './categories';

const ENCOURAGEMENTS = [
  'Muito bem!', 'Que orgulho!', 'Você conseguiu!',
  'Você é incrível!', 'Bom trabalho!', 'Parabéns!', 'Continue assim!',
];

export function celebrateCompletion(a: Activity) {
  const color = colorForActivity(a);
  pushHistory({
    id: a.id, name: a.name, icon: a.icon, color,
    time: a.timeStart,
    completedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    date: todayKey(), type: 'completed',
    tasksDone: (a.tasks || []).filter((t) => t.done).length,
    tasksTotal: (a.tasks || []).length,
  });
  celebrate(a, color);
}

function celebrate(a: Activity, accent: string) {
  const layer = document.getElementById('nv-celebration-layer');
  if (layer) {
    const COLORS = [accent, '#5b8def', '#f5a623', '#2fbf71', '#ec4899', '#a78bfa'];
    for (let i = 0; i < 50; i++) {
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
  }
  const phrase = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  toast(`${a.icon || '✨'} ${phrase}`, 'success');
  chime('success');
  vibrate([60, 40, 100]);
  speak(`${phrase} ${a.name} concluída.`);
}

export function toast(msg: string, kind: 'success' | 'info' = 'info') {
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
