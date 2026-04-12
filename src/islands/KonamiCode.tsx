import { useEffect, useState } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export default function KonamiCode() {
  const [retroMode, setRetroMode] = useState(false);

  useEffect(() => {
    let position = 0;

    function handleKey(e: KeyboardEvent) {
      if (e.key === KONAMI[position]) {
        position++;
        if (position === KONAMI.length) {
          position = 0;
          setRetroMode((prev) => {
            const next = !prev;
            if (next) {
              document.documentElement.classList.add("retro-mode");
              window.dispatchEvent(
                new CustomEvent("achievement", { detail: "konami" }),
              );
            } else {
              document.documentElement.classList.remove("retro-mode");
            }
            return next;
          });
        }
      } else {
        position = 0;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!retroMode) return null;

  return (
    <div
      className="fixed top-16 left-1/2 -translate-x-1/2 z-[var(--z-overlay)] px-4 py-2 rounded
                  border border-[var(--color-phosphor)]/40
                  bg-[var(--color-screen-panel)]"
    >
      <p
        className="text-[var(--color-phosphor)] text-[8px] tracking-wider uppercase"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        Retro Mode Active — ↑↑↓↓←→←→BA to toggle
      </p>
    </div>
  );
}
