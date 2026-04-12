import { useState, useEffect, useRef } from "react";

const LEVELS = [
  { threshold: 0, label: "LV1" },
  { threshold: 25, label: "LV2" },
  { threshold: 50, label: "LV3" },
  { threshold: 75, label: "LV4" },
  { threshold: 100, label: "LV5" },
];

const BAR_SEGMENTS = 20;

function getLevel(filled: number) {
  // filled is 0-20; map to threshold percentage
  const percent = (filled / BAR_SEGMENTS) * 100;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (percent >= LEVELS[i].threshold) return LEVELS[i];
  }
  return LEVELS[0];
}

export default function ScrollProgress() {
  // Quantized to 0-20 so we only re-render when a bar segment changes
  const [filled, setFilled] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const prevLevel = useRef("LV1");

  useEffect(() => {
    let rafId: number | null = null;

    function update() {
      rafId = null;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      const nextFilled = Math.round(progress / 5);

      setFilled((prev) => (prev === nextFilled ? prev : nextFilled));

      const currentLevel = getLevel(nextFilled).label;
      if (currentLevel !== prevLevel.current) {
        prevLevel.current = currentLevel;
        setLevelUp(true);
        setTimeout(() => setLevelUp(false), 1200);
      }
    }

    function onScroll() {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const level = getLevel(filled);
  const progressPercent = Math.round((filled / BAR_SEGMENTS) * 100);

  return (
    <div
      className="hidden lg:flex items-center gap-2 text-xs relative font-pixel"
      aria-label={`Page scroll progress: ${progressPercent}%`}
    >
      <span
        className={`text-[8px] transition-colors duration-300 ${
          levelUp
            ? "text-[var(--color-glow-primary)]"
            : "text-[var(--color-text-faint)]"
        }`}
      >
        {level.label}
      </span>
      <div className="flex items-center gap-px">
        <span className="text-[var(--color-text-faint)] text-[10px]">[</span>
        {Array.from({ length: BAR_SEGMENTS }).map((_, i) => (
          <span
            key={i}
            className={`inline-block w-1.5 h-2.5 transition-colors duration-150 ${
              i < filled
                ? "bg-[var(--color-glow-primary)]"
                : "bg-[var(--color-screen-raised)]"
            }`}
          />
        ))}
        <span className="text-[var(--color-text-faint)] text-[10px]">]</span>
      </div>
      <span className="text-[var(--color-text-faint)] text-[7px]">XP</span>

      {levelUp && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[var(--color-glow-primary)] text-[8px] animate-bounce font-pixel">
          LVL UP!
        </div>
      )}
    </div>
  );
}
