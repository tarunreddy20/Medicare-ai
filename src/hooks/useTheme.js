import { useState, useEffect } from "react";

const THEME_KEY = "medicare-theme";
const PREFS_KEY = "medicare-preferences";
const FONT_SIZES = { small: "14px", medium: "16px", large: "18px", xlarge: "22px" };

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
];

const PREF_DEFAULTS = {
  fontSize: "medium",
  ttsEnabled: false,
  soundEnabled: true,
  language: "en",
  userName: "",
};

export function usePreferences() {
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(PREFS_KEY);
      return stored ? { ...PREF_DEFAULTS, ...JSON.parse(stored) } : PREF_DEFAULTS;
    } catch { return PREF_DEFAULTS; }
  });

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    document.documentElement.style.setProperty("--app-font-size", FONT_SIZES[prefs.fontSize] || "16px");
  }, [prefs]);

  const update = (key, value) => setPrefs((p) => ({ ...p, [key]: value }));
  return { prefs, update, FONT_SIZES };
}

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

export function useTTS(enabled) {
  const speak = (text) => {
    if (!enabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const plain = text.replace(/[#*_`>\-|]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    const utterance = new SpeechSynthesisUtterance(plain);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };
  const stop = () => window.speechSynthesis?.cancel();
  return { speak, stop };
}

export function useNotificationSound(enabled) {
  const play = () => {
    if (!enabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 680;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) { /* silent fallback */ }
  };
  return { play };
}

export const EMERGENCY_KEYWORDS = [
  "chest pain", "heart attack", "can't breathe", "cannot breathe",
  "stroke", "seizure", "unconscious", "severe bleeding",
  "choking", "anaphylaxis", "overdose", "suicide",
  "loss of consciousness", "paralysis", "not breathing",
];

export function detectEmergency(text) {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}
