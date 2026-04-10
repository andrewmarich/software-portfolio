import { useState, useEffect, useCallback, useRef } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-visit",
    title: "Bonfire Lit",
    description: "Arrived at marich.dev",
    icon: "🔥",
  },
  {
    id: "scroll-bottom",
    title: "You Died",
    description: "Reached the bottom of the page",
    icon: "💀",
  },
  {
    id: "konami",
    title: "Cheat Code",
    description: "↑↑↓↓←→←→BA",
    icon: "🎮",
  },
  {
    id: "terminal",
    title: "Sequence Break",
    description: "Opened the hidden terminal",
    icon: "💻",
  },
  {
    id: "contact-click",
    title: "Side Quest",
    description: "Clicked a contact link",
    icon: "📜",
  },
  {
    id: "idle-60",
    title: "Idle Animation",
    description: "Stayed for over 60 seconds",
    icon: "🕐",
  },
  {
    id: "return-visit",
    title: "New Game+",
    description: "Returned to the site",
    icon: "🔄",
  },
];

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

export default function Achievements() {
  const [toast, setToast] = useState<Achievement | null>(null);
  const [visible, setVisible] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const toastQueue = useRef<Achievement[]>([]);
  const isShowingToast = useRef(false);

  // Sync state on mount
  useEffect(() => {
    setUnlockedIds(getUnlocked());
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
      const unlocked = getUnlocked();
      if (unlocked.has(id)) return;

      unlocked.add(id);
      saveUnlocked(unlocked);
      setUnlockedIds(new Set(unlocked));

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
    // Return visit check
    try {
      if (localStorage.getItem(VISIT_KEY)) {
        setTimeout(() => unlock("return-visit"), 1500);
      }
      localStorage.setItem(VISIT_KEY, "1");
    } catch {}

    // First visit achievement
    setTimeout(() => unlock("first-visit"), 2500);

    // Scroll to bottom
    function checkScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollTop / docHeight > 0.95) {
        unlock("scroll-bottom");
      }
    }
    window.addEventListener("scroll", checkScroll, { passive: true });

    // Contact link clicks
    function checkContact(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="mailto"], a[href*="github"], a[href*="linkedin"]');
      if (link) unlock("contact-click");
    }
    document.addEventListener("click", checkContact);

    // Idle for 60 seconds
    const idleTimer = setTimeout(() => unlock("idle-60"), 60000);

    // Custom achievement events from other islands
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

  const total = ACHIEVEMENTS.length;
  const count = unlockedIds.size;

  return (
    <>
      {/* Achievement toast */}
      {toast && (
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
      )}

      {/* Collection counter — fixed bottom-left */}
      <button
        onClick={() => setShowCollection((prev) => !prev)}
        className="fixed bottom-6 left-6 z-[140] flex items-center gap-2 px-3 py-1.5
                   rounded border border-[var(--color-screen-raised)]/50
                   bg-[var(--color-screen-panel)]/80 backdrop-blur-sm
                   hover:border-[var(--color-glow-amber)]/30 transition-all
                   cursor-pointer"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        <span className="text-sm">🏆</span>
        <span className="text-[8px] text-[var(--color-text-muted)]">
          {count}/{total}
        </span>
      </button>

      {/* Collection panel */}
      {showCollection && (
        <div className="fixed bottom-16 left-6 z-[140] w-72 rounded-lg border
                        border-[var(--color-screen-raised)]
                        bg-[var(--color-screen-panel)] shadow-xl shadow-black/30
                        overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--color-screen-raised)]">
            <p
              className="text-[var(--color-glow-amber)] text-[8px] uppercase tracking-widest"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              Achievements — {count}/{total}
            </p>
          </div>
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = unlockedIds.has(a.id);
              return (
                <div
                  key={a.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded
                              ${unlocked ? "bg-[var(--color-screen-raised)]/50" : "opacity-40"}`}
                >
                  <span className={`text-base ${unlocked ? "" : "grayscale"}`}>
                    {unlocked ? a.icon : "❓"}
                  </span>
                  <div>
                    <p
                      className="text-[var(--color-text-bright)] text-xs font-medium"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {unlocked ? a.title : "???"}
                    </p>
                    <p
                      className="text-[var(--color-text-faint)] text-[10px]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {unlocked ? a.description : "Keep exploring..."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
