import { useState, useEffect, useCallback } from "react";

const BOOT_LINES = [
  { text: "MARICH SYSTEMS BIOS v1.0", style: "header" },
  { text: "Copyright (C) 2020-2026 Andrew Marich", style: "dim" },
  { text: "", style: "normal" },
  { text: "Checking system components...", style: "normal" },
  { text: "  CPU: Full-Stack Engineer (multi-core)", style: "normal" },
  { text: "  RAM: 2x BS Degrees (Finance + CS)", style: "normal" },
  { text: "  GPU: Pixel-perfect UI rendering", style: "normal" },
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
      return "text-[var(--color-glow-amber)] font-bold";
    case "dim":
      return "text-[var(--color-text-faint)]";
    case "success":
      return "text-[var(--color-phosphor)]";
    case "cyan":
      return "text-[var(--color-neon-cyan)]";
    case "command":
      return "text-[var(--color-glow-amber)]";
    case "ready":
      return "text-[var(--color-phosphor)] font-bold text-lg tracking-wider";
    default:
      return "text-[var(--color-text-muted)]";
  }
}

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [phase, setPhase] = useState<"typing" | "waiting" | "flash" | "done">(
    "typing",
  );
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

    // Show lines progressively
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setVisibleLines(current);
      if (current >= BOOT_LINES.length) {
        clearInterval(timer);
        setPhase("waiting");
      }
    }, LINE_DELAY);

    return () => clearInterval(timer);
  }, []);

  // Listen for any key/click to continue once in "waiting" phase
  useEffect(() => {
    if (phase !== "waiting") return;

    function handleContinue() {
      finishBoot();
    }

    window.addEventListener("keydown", handleContinue, { once: true });
    window.addEventListener("click", handleContinue, { once: true });
    window.addEventListener("touchstart", handleContinue, { once: true });

    return () => {
      window.removeEventListener("keydown", handleContinue);
      window.removeEventListener("click", handleContinue);
      window.removeEventListener("touchstart", handleContinue);
    };
  }, [phase, finishBoot]);

  if (skipBoot || phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center
                   bg-[var(--color-screen-void)] transition-opacity duration-300
                   ${phase === "flash" ? "opacity-0" : "opacity-100"}`}
      role="presentation"
    >
      <div className="max-w-xl w-full px-6">
        <pre
          className="text-xs sm:text-sm leading-relaxed select-none"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={getLineClass(line.style)}>
              {line.text}
            </div>
          ))}
        </pre>

        {/* Press any key prompt — only shows after all lines are visible */}
        {phase === "waiting" && (
          <p
            className="mt-8 text-center text-[var(--color-glow-amber)] text-[8px] tracking-widest uppercase animate-pulse"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            Press any key to continue
          </p>
        )}
      </div>
    </div>
  );
}
