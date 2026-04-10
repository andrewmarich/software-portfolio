import { useState, useEffect, useCallback } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "scroll-bottom",
    title: "Completionist",
    description: "Scrolled to the bottom of the page",
    icon: "🏆",
  },
  {
    id: "konami",
    title: "Old School",
    description: "Entered the Konami Code",
    icon: "🎮",
  },
  {
    id: "terminal",
    title: "Hacker",
    description: "Opened the terminal",
    icon: "💻",
  },
  {
    id: "first-visit",
    title: "Welcome",
    description: "Visited marich.dev for the first time",
    icon: "👋",
  },
];

const STORAGE_KEY = "marich-achievements";

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

export default function Achievements() {
  const [toast, setToast] = useState<Achievement | null>(null);
  const [visible, setVisible] = useState(false);

  const unlock = useCallback((id: string) => {
    const unlocked = getUnlocked();
    if (unlocked.has(id)) return;

    unlocked.add(id);
    saveUnlocked(unlocked);

    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    if (!achievement) return;

    setToast(achievement);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    // First visit achievement
    const unlocked = getUnlocked();
    if (!unlocked.has("first-visit")) {
      setTimeout(() => unlock("first-visit"), 2000);
    }

    // Scroll to bottom achievement
    function checkScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollTop / docHeight > 0.95) {
        unlock("scroll-bottom");
      }
    }
    window.addEventListener("scroll", checkScroll, { passive: true });

    // Listen for custom achievement events from other islands
    function handleAchievement(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      unlock(detail);
    }
    window.addEventListener("achievement", handleAchievement);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("achievement", handleAchievement);
    };
  }, [unlock]);

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[150] max-w-xs transition-all duration-500
                   ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg border
                    border-[var(--color-glow-amber)]/30
                    bg-[var(--color-screen-panel)] shadow-lg
                    shadow-[var(--color-glow-amber)]/5"
      >
        <span className="text-xl">{toast.icon}</span>
        <div>
          <p
            className="text-[var(--color-glow-amber)] text-[8px] uppercase tracking-widest mb-0.5"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            Achievement Unlocked
          </p>
          <p
            className="text-[var(--color-text-bright)] text-sm font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {toast.title}
          </p>
          <p
            className="text-[var(--color-text-faint)] text-xs"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {toast.description}
          </p>
        </div>
      </div>
    </div>
  );
}
