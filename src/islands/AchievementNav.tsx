import { useState, useEffect, useRef, useCallback } from "react";
import type { Achievement } from "./achievement-data";
import { useClickOutside } from "./hooks";

const STORAGE_KEY = "marich-achievements";

function getUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

interface Props {
  achievements: Achievement[];
}

export default function AchievementNav({ achievements }: Props) {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read localStorage after mount to avoid SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        className="flex cursor-pointer items-center gap-1.5 text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-glow-primary)]"
        aria-label={`Achievements: ${count} of ${achievements.length}`}
      >
        <span className="text-xs">🏆</span>
        <span className="font-pixel text-[8px]">
          {count}/{achievements.length}
        </span>
      </button>

      {open && (
        <div className="absolute top-8 right-0 z-50 w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-[var(--color-screen-raised)] bg-[var(--color-screen-panel)] shadow-xl shadow-black/30">
          <div className="border-b border-[var(--color-screen-raised)] px-3 py-2">
            <p className="font-pixel text-[7px] tracking-widest text-[var(--color-glow-primary)] uppercase">
              Achievements — {count}/{achievements.length}
            </p>
          </div>
          <div className="max-h-72 space-y-1 overflow-y-auto p-2">
            {achievements.map((a) => {
              const isUnlocked = unlocked.has(a.id);
              return (
                <div
                  key={a.id}
                  className={`flex items-center gap-2.5 rounded px-2.5 py-1.5 ${isUnlocked ? "bg-[var(--color-screen-raised)]/40" : "opacity-35"}`}
                >
                  <span className={`text-sm ${isUnlocked ? "" : "grayscale"}`}>
                    {isUnlocked ? a.icon : "❓"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-[var(--color-text-bright)]">
                      {isUnlocked ? a.title : "???"}
                    </p>
                    <p className="truncate font-mono text-[9px] text-[var(--color-text-faint)]">
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
