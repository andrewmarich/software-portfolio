import { useState, useEffect, useCallback } from "react";

const BOOT_LINES = [
  { text: "MARICH SYSTEMS BIOS v1.0", style: "header" },
  { text: "Copyright (C) 2026 Andrew Marich", style: "dim" },
  { text: "", style: "normal" },
  { text: "Loading modules:", style: "normal" },
  { text: "  react@19 ................ OK", style: "success" },
  { text: "  django@6 ................ OK", style: "success" },
  { text: "  cloudflare-workers ...... OK", style: "success" },
  { text: "  tailwind@4 .............. OK", style: "success" },
  { text: "  typescript .............. OK", style: "success" },
  { text: "", style: "normal" },
  { text: "Mounting projects:", style: "normal" },
  { text: "  /dev/balance ............ ACTIVE", style: "cyan" },
  { text: "  /dev/b1-marketing ....... ACTIVE", style: "cyan" },
  { text: "", style: "normal" },
  { text: "> andrew.marich --role='full-stack engineer'", style: "command" },
  { text: "", style: "normal" },
  { text: "SYSTEM READY", style: "ready" },
] as const;

const LINE_DELAY = 80;
const STORAGE_KEY = "marich-boot-seen";

type LineStyle = (typeof BOOT_LINES)[number]["style"];

function getLineClass(style: LineStyle): string {
  switch (style) {
    case "header":
      return "text-[var(--color-glow-primary)] font-bold";
    case "dim":
      return "text-[var(--color-text-faint)]";
    case "success":
      return "text-[var(--color-phosphor)]";
    case "cyan":
      return "text-[var(--color-neon-cyan)]";
    case "command":
      return "text-[var(--color-glow-primary)]";
    case "ready":
      return "text-[var(--color-phosphor)] font-bold text-lg tracking-wider";
    default:
      return "text-[var(--color-text-muted)]";
  }
}

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [phase, setPhase] = useState<"typing" | "waiting" | "flash" | "done">("typing");
  const [skipBoot, setSkipBoot] = useState(false);

  const finishBoot = useCallback(() => {
    setPhase("flash");
    setTimeout(() => {
      setPhase("done");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }, 300);
  }, []);

  useEffect(() => {
    // Check if already seen this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        setSkipBoot(true);
        setPhase("done");
        return;
      }
    } catch {}

    // Show lines progressively, skip delay on empty lines
    let current = 0;
    function showNext() {
      current++;
      setVisibleLines(current);
      if (current >= BOOT_LINES.length) {
        setPhase("waiting");
        return;
      }
      const nextDelay = BOOT_LINES[current]?.text === "" ? 10 : LINE_DELAY;
      setTimeout(showNext, nextDelay);
    }
    const initialTimer = setTimeout(showNext, LINE_DELAY);

    return () => clearTimeout(initialTimer);
  }, []);

  // Listen for any key/click — skip to end during typing, dismiss during waiting
  useEffect(() => {
    if (phase !== "typing" && phase !== "waiting") return;

    function handleInteraction() {
      if (phase === "typing") {
        setVisibleLines(BOOT_LINES.length);
        setPhase("waiting");
      } else {
        finishBoot();
      }
    }

    window.addEventListener("keydown", handleInteraction, { once: true });
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [phase, finishBoot]);

  if (skipBoot || phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[var(--z-boot)] flex items-center justify-center bg-[var(--color-screen-void)] transition-opacity duration-300 ${phase === "flash" ? "opacity-0" : "opacity-100"}`}
      role="presentation"
    >
      <div className="w-full max-w-xl px-6">
        <pre
          className="text-xs leading-relaxed select-none sm:text-sm"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={getLineClass(line.style)}>
              {line.text}
            </div>
          ))}
        </pre>

        {/* Dismiss prompt — only shows after all lines are visible */}
        {phase === "waiting" && (
          <p
            className="mt-8 animate-pulse text-center text-[8px] tracking-widest text-[var(--color-glow-primary)] uppercase"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            Tap or press any key to continue
          </p>
        )}
      </div>
    </div>
  );
}
