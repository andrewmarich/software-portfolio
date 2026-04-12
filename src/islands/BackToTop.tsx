import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const next = window.scrollY > window.innerHeight;
      setVisible((prev) => (prev === next ? prev : next));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 left-6 z-[var(--z-overlay)] w-10 h-10 rounded border
                  border-[var(--color-screen-raised)] bg-[var(--color-screen-panel)]
                  text-[var(--color-text-faint)] hover:text-[var(--color-glow-amber)]
                  hover:border-[var(--color-glow-amber)]/40
                  transition-all duration-300 cursor-pointer
                  flex items-center justify-center
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
