import { useState, useEffect, useRef, useCallback } from "react";
import { ACHIEVEMENTS, getUnlocked } from "./achievement-data";
import { useClickOutside } from "./hooks";

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
    return () => window.removeEventListener("achievement-unlocked", sync);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const count = unlocked.size;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-[var(--color-text-faint)] hover:text-[var(--color-glow-primary)] transition-colors cursor-pointer"
        aria-label={`Achievements: ${count} of ${ACHIEVEMENTS.length}`}
      >
        <span className="text-xs">🏆</span>
        <span className="text-[8px] font-pixel">
          {count}/{ACHIEVEMENTS.length}
        </span>
      </button>

      {open && (
        <div
          className="absolute top-8 right-0 w-[min(16rem,calc(100vw-2rem))] rounded-lg border
                      border-[var(--color-screen-raised)]
                      bg-[var(--color-screen-panel)] shadow-xl shadow-black/30
                      overflow-hidden z-50"
        >
          <div className="px-3 py-2 border-b border-[var(--color-screen-raised)]">
            <p className="text-[var(--color-glow-primary)] text-[7px] uppercase tracking-widest font-pixel">
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
                    <p className="text-[var(--color-text-bright)] text-[11px] font-medium truncate">
                      {isUnlocked ? a.title : "???"}
                    </p>
                    <p className="text-[var(--color-text-faint)] text-[9px] truncate font-mono">
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
