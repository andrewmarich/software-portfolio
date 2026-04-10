import { useState, useEffect } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const filled = Math.round(progress / 5);
  const empty = 20 - filled;

  return (
    <div
      className="hidden lg:flex items-center gap-2 text-xs"
      style={{ fontFamily: "var(--font-pixel)" }}
      aria-label={`Page scroll progress: ${Math.round(progress)}%`}
    >
      <span className="text-[var(--color-text-faint)] text-[8px]">HP</span>
      <div className="flex items-center gap-px">
        <span className="text-[var(--color-text-faint)] text-[10px]">[</span>
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`inline-block w-1.5 h-2.5 ${
              i < filled
                ? progress > 60
                  ? "bg-[var(--color-phosphor)]"
                  : progress > 30
                    ? "bg-[var(--color-glow-amber)]"
                    : "bg-[var(--color-neon-magenta)]"
                : "bg-[var(--color-screen-raised)]"
            }`}
          />
        ))}
        <span className="text-[var(--color-text-faint)] text-[10px]">]</span>
      </div>
    </div>
  );
}
