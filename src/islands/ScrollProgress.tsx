import { useState, useEffect, useRef } from "react";

const LEVELS = [
  { threshold: 0, label: "LV1" },
  { threshold: 25, label: "LV2" },
  { threshold: 50, label: "LV3" },
  { threshold: 75, label: "LV4" },
  { threshold: 100, label: "LV5" },
];

function getLevel(progress: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (progress >= LEVELS[i].threshold) return LEVELS[i];
  }
  return LEVELS[0];
}

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const prevLevel = useRef("LV1");

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(p);

      const currentLevel = getLevel(p).label;
      if (currentLevel !== prevLevel.current) {
        prevLevel.current = currentLevel;
        setLevelUp(true);
        setTimeout(() => setLevelUp(false), 1200);
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const filled = Math.round(progress / 5);
  const level = getLevel(progress);

  return (
    <div
      className="hidden lg:flex items-center gap-2 text-xs relative"
      style={{ fontFamily: "var(--font-pixel)" }}
      aria-label={`Page scroll progress: ${Math.round(progress)}%`}
    >
      <span
        className={`text-[8px] transition-colors duration-300 ${
          levelUp
            ? "text-[var(--color-glow-amber)]"
            : "text-[var(--color-text-faint)]"
        }`}
      >
        {level.label}
      </span>
      <div className="flex items-center gap-px">
        <span className="text-[var(--color-text-faint)] text-[10px]">[</span>
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`inline-block w-1.5 h-2.5 transition-colors duration-150 ${
              i < filled
                ? "bg-[var(--color-glow-amber)]"
                : "bg-[var(--color-screen-raised)]"
            }`}
          />
        ))}
        <span className="text-[var(--color-text-faint)] text-[10px]">]</span>
      </div>
      <span className="text-[var(--color-text-faint)] text-[7px]">XP</span>

      {/* Level up toast */}
      {levelUp && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                     text-[var(--color-glow-amber)] text-[8px] animate-bounce"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          LVL UP!
        </div>
      )}
    </div>
  );
}
