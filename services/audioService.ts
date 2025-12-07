import { Mode } from '../types';

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playModeTransitionSound = (mode: Mode) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (mode === 'PAWS') {
      // PAWS: Soft, low "rumble/sigh" (Sine wave, gentle envelope)
      osc.type = 'sine';
      
      // Pitch: Low, warm tone (Starts at 220Hz, slight drop to 180Hz for "settling" feel)
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.4);

      // Volume: Slow attack, long release
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.start(now);
      osc.stop(now + 0.5);

    } else {
      // CLAWS: Sharp, tactical "click/latch" (Square wave, fast envelope)
      osc.type = 'square'; // Or 'sawtooth' for grittier sound

      // Pitch: Mechanical chirp (Starts high, drops fast)
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

      // Volume: Instant attack, fast decay
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
      
      // Add a secondary "lock" click for CLAWS
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(200, now + 0.1);
      
      gain2.gain.setValueAtTime(0, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.1, now + 0.11);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      
      osc2.start(now + 0.1);
      osc2.stop(now + 0.2);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};