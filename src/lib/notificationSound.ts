import { safeStorage } from "./safeStorage";

const SOUND_PREF_KEY = "hc_sound_notifications_enabled";

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtxClass) return null;

    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AudioCtxClass();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Checks whether audio feedback is enabled by user preference (defaults to true).
 */
export function isNotificationSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return safeStorage.getItem<boolean>(SOUND_PREF_KEY, true) ?? true;
}

/**
 * Updates the user's notification sound preference.
 */
export function setNotificationSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  safeStorage.setItem(SOUND_PREF_KEY, enabled);
  window.dispatchEvent(
    new CustomEvent("hc-sound-preference-change", { detail: { enabled } })
  );
}

/**
 * Plays a pleasant, subtle two-tone chime (G5 -> C6) via Web Audio API.
 * Completely zero-dependency, non-blocking, and handles autoplay constraints gracefully.
 */
export function playNotificationSound(): void {
  if (typeof window === "undefined") return;
  if (!isNotificationSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Handle suspended state due to browser autoplay policies
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {
        // Autoplay policy prevented resumption without user gesture
      });
      if (ctx.state === "suspended") return;
    }

    const now = ctx.currentTime;

    // Master gain node for gentle, non-jarring volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, now);
    masterGain.connect(ctx.destination);

    // Tone 1: Warm intro note (G5 - 783.99 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(783.99, now);
    gain1.gain.setValueAtTime(0.01, now);
    gain1.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.14);

    // Tone 2: Bright, uplifting resolve note (C6 - 1046.50 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, now + 0.08);
    gain2.gain.setValueAtTime(0.01, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.14, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.38);
  } catch {
    // Graceful silent fallback if Web Audio is unsupported or throws
  }
}
