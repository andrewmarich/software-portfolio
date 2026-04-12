import { useState, useEffect, useCallback, useRef } from "react";
import { type Achievement, ACHIEVEMENTS, getUnlocked, saveUnlocked } from "./achievement-data";

const VISIT_KEY = "marich-visited-before";

export default function Achievements() {
  const [toast, setToast] = useState<Achievement | null>(null);
  const [visible, setVisible] = useState(false);
  const toastQueue = useRef<Achievement[]>([]);
  const isShowingToast = useRef(false);
  const unlockedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    unlockedRef.current = getUnlocked();
  }, []);

  const showNextToast = useCallback(() => {
    if (toastQueue.current.length === 0) {
      isShowingToast.current = false;
      return;
    }

    isShowingToast.current = true;
    const achievement = toastQueue.current.shift()!;
    setToast(achievement);
    setVisible(true);

    setTimeout(() => setVisible(false), 3000);
    setTimeout(() => {
      setToast(null);
      showNextToast();
    }, 3500);
  }, []);

  const unlock = useCallback(
    (id: string) => {
      if (unlockedRef.current.has(id)) return;

      unlockedRef.current.add(id);
      saveUnlocked(unlockedRef.current);
      window.dispatchEvent(new Event("achievement-unlocked"));

      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (!achievement) return;

      toastQueue.current.push(achievement);
      if (!isShowingToast.current) {
        showNextToast();
      }
    },
    [showNextToast],
  );

  useEffect(() => {
    try {
      if (localStorage.getItem(VISIT_KEY)) {
        setTimeout(() => unlock("return-visit"), 1500);
      }
      localStorage.setItem(VISIT_KEY, "1");
    } catch {}

    setTimeout(() => unlock("first-visit"), 2500);

    function checkScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
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

    const idleTimer = setTimeout(() => unlock("idle-60"), 60000);

    function handleAchievement(e: Event) {
      unlock((e as CustomEvent<string>).detail);
    }
    window.addEventListener("achievement", handleAchievement);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      document.removeEventListener("click", checkContact);
      clearTimeout(idleTimer);
      window.removeEventListener("achievement", handleAchievement);
    };
  }, [unlock]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[var(--z-overlay)] max-w-xs transition-all duration-500
                   ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg border
                    border-[var(--color-glow-primary)]/30
                    bg-[var(--color-screen-panel)] shadow-lg
                    shadow-[var(--color-glow-primary)]/5"
      >
        <span className="text-xl">{toast.icon}</span>
        <div>
          <p className="text-[var(--color-glow-primary)] text-[8px] uppercase tracking-widest mb-0.5 font-pixel">
            Achievement Unlocked
          </p>
          <p className="text-[var(--color-text-bright)] text-sm font-medium">
            {toast.title}
          </p>
          <p className="text-[var(--color-text-faint)] text-xs font-mono">
            {toast.description}
          </p>
        </div>
      </div>
    </div>
  );
}
