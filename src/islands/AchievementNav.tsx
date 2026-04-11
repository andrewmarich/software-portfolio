import { useState, useEffect, useRef } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first-visit", title: "A New Save File", description: "Arrived at marich.dev", icon: "💾" },
  { id: "scroll-bottom", title: "Completionist", description: "Reached the bottom of the page", icon: "🏆" },
  { id: "konami", title: "Cheat Code", description: "↑↑↓↓←→←→BA", icon: "🎮" },
  { id: "terminal", title: "Sequence Break", description: "Opened the hidden terminal", icon: "💻" },
  { id: "contact-click", title: "Side Quest", description: "Clicked a contact link", icon: "📜" },
  { id: "idle-60", title: "Idle Animation", description: "Stayed for over 60 seconds", icon: "🕐" },
  { id: "return-visit", title: "New Game+", description: "Returned to the site", icon: "🔄" },
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

export default function AchievementNav() {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUnlocked(getUnlocked());

    function sync() {
      setUnlocked(getUnlocked());
    }

    window.addEventListener("achievement-unlocked", sync);
    const interval = setInterval(sync, 2000);

    return () => {
      window.removeEventListener("achievement-unlocked", sync);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  const count = unlocked.size;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-[var(--color-text-faint)] hover:text-[var(--color-glow-amber)] transition-colors cursor-pointer"
        aria-label={`Achievements: ${count} of ${ACHIEVEMENTS.length}`}
      >
        <span className="text-xs">🏆</span>
        <span
          className="text-[8px]"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          {count}/{ACHIEVEMENTS.length}
        </span>
      </button>

      {open && (
        <div
          className="absolute top-8 right-0 w-64 rounded-lg border
                      border-[var(--color-screen-raised)]
                      bg-[var(--color-screen-panel)] shadow-xl shadow-black/30
                      overflow-hidden z-50"
        >
          <div className="px-3 py-2 border-b border-[var(--color-screen-raised)]">
            <p
              className="text-[var(--color-glow-amber)] text-[7px] uppercase tracking-widest"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              Achievements — {count}/{ACHIEVEMENTS.length}
            </p>
          </div>
          <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
            {ACHIEVEMENTS.map((a) => {
              const isUnlocked = unlocked.has(a.id);
              return (
                <div
                  key={a.id}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded
                              ${isUnlocked ? "bg-[var(--color-screen-raised)]/40" : "opacity-35"}`}
                >
                  <span className={`text-sm ${isUnlocked ? "" : "grayscale"}`}>
                    {isUnlocked ? a.icon : "❓"}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[var(--color-text-bright)] text-[11px] font-medium truncate"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {isUnlocked ? a.title : "???"}
                    </p>
                    <p
                      className="text-[var(--color-text-faint)] text-[9px] truncate"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {isUnlocked ? a.description : "Keep exploring..."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
