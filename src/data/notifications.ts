// @ts-nocheck
import { loadSettings } from './store';

/** Solicita permissão de notificação uma vez por sessão. */
export function requestPermissions() {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  } catch {}
}

export function notify(title: string, body: string) {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon.svg', tag: `nv-${title}`, silent: !loadSettings().sound });
    }
  } catch {}
}

export function speak(text: string) {
  if (!loadSettings().voice) return;
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    u.rate = 1; u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function vibrate(pattern: number | number[] = [60, 40, 60]) {
  if (!loadSettings().vibrate) return;
  try { (navigator as any).vibrate?.(pattern); } catch {}
}

/** Som curto de chime via Web Audio (sem assets). */
export function chime(kind: 'soft' | 'success' | 'urgent' = 'soft') {
  if (!loadSettings().sound) return;
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    const freq = kind === 'urgent' ? 880 : kind === 'success' ? 660 : 520;
    o.frequency.value = freq;
    o.type = 'sine';
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
    o.start();
    o.stop(ctx.currentTime + 0.5);
    if (kind === 'success') {
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.connect(g2); g2.connect(ctx.destination);
      o2.frequency.value = 880; o2.type = 'sine';
      g2.gain.setValueAtTime(0.0001, ctx.currentTime + 0.15);
      g2.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.17);
      g2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      o2.start(ctx.currentTime + 0.15);
      o2.stop(ctx.currentTime + 0.65);
    }
  } catch {}
}
