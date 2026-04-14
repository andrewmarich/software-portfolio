import { useState, useEffect, useCallback, useRef } from "react";
import type { Achievement } from "./achievement-data";

const STORAGE_KEY = "marich-achievements";
const VISIT_KEY = "marich-visited-before";

function getUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveUnlocked(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {}
}

interface Props {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: Props) {
  const [toast, setToast] = useState<Achievement | null>(null);
  const [visible, setVisible] = useState(false);
  const toastQueue = useRef<Achievement[]>([]);
  const isShowingToast = useRef(false);
  const unlockedRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    unlockedRef.current = getUnlocked();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const showNextToast = useCallback(async () => {
    if (isShowingToast.current) return;
    isShowingToast.current = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    while (toastQueue.current.length > 0 && mountedRef.current) {
      const achievement = toastQueue.current.shift()!;
      setToast(achievement);
      setVisible(true);
      await wait(3000);
      if (!mountedRef.current) return;
      setVisible(false);
      await wait(500);
      if (!mountedRef.current) return;
      setToast(null);
    }
    isShowingToast.current = false;
  }, []);

  const unlock = useCallback(
    (id: string) => {
      if (unlockedRef.current.has(id)) return;

      unlockedRef.current.add(id);
      saveUnlocked(unlockedRef.current);
      window.dispatchEvent(new Event("achievement-unlocked"));

      const achievement = achievements.find((a) => a.id === id);
      if (!achievement) return;

      toastQueue.current.push(achievement);
      if (!isShowingToast.current) {
        showNextToast();
      }
    },
    [achievements, showNextToast],
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    try {
      if (localStorage.getItem(VISIT_KEY)) {
        timers.push(setTimeout(() => unlock("return-visit"), 1500));
      }
      localStorage.setItem(VISIT_KEY, "1");
    } catch {}

    timers.push(setTimeout(() => unlock("first-visit"), 2500));
    timers.push(setTimeout(() => unlock("idle-60"), 60000));

    function checkScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollTop / docHeight > 0.95) {
        unlock("scroll-bottom");
      }
    }
    window.addEventListener("scroll", checkScroll, { passive: true });

    function checkContact(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="mailto"], a[href*="github"], a[href*="linkedin"]');
      if (link) unlock("contact-click");
    }
    document.addEventListener("click", checkContact);

    function handleAchievement(e: Event) {
      unlock((e as CustomEvent<string>).detail);
    }
    window.addEventListener("achievement", handleAchievement);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      document.removeEventListener("click", checkContact);
      window.removeEventListener("achievement", handleAchievement);
      timers.forEach(clearTimeout);
    };
  }, [unlock]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-6 bottom-6 z-[var(--z-overlay)] max-w-xs transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <div className="flex items-center gap-3 rounded-lg border border-[var(--color-glow-primary)]/30 bg-[var(--color-screen-panel)] px-4 py-3 shadow-[var(--color-glow-primary)]/5 shadow-lg">
        <span className="text-xl">{toast.icon}</span>
        <div>
          <p className="font-pixel mb-0.5 text-[8px] tracking-widest text-[var(--color-glow-primary)] uppercase">
            Achievement Unlocked
          </p>
          <p className="text-sm font-medium text-[var(--color-text-bright)]">{toast.title}</p>
          <p className="font-mono text-xs text-[var(--color-text-faint)]">{toast.description}</p>
        </div>
      </div>
    </div>
  );
}
