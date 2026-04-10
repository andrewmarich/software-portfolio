import { useState, useEffect, useCallback } from "react";

const BOOT_LINES = [
  { text: "MARICH SYSTEMS BIOS v1.0", delay: 0, style: "header" },
  { text: "Copyright (C) 2020-2026 Andrew Marich", delay: 100, style: "dim" },
  { text: "", delay: 200, style: "normal" },
  { text: "Checking system components...", delay: 300, style: "normal" },
  { text: "  CPU: Full-Stack Engineer (multi-core)", delay: 450, style: "normal" },
  { text: "  RAM: 2x BS Degrees (Finance + CS)", delay: 600, style: "normal" },
  { text: "", delay: 700, style: "normal" },
  { text: "Loading modules:", delay: 800, style: "normal" },
  { text: "  react@19 ................ OK", delay: 950, style: "success" },
  { text: "  django@6 ................ OK", delay: 1100, style: "success" },
  { text: "  cloudflare-workers ...... OK", delay: 1250, style: "success" },
  { text: "  tailwind@4 .............. OK", delay: 1400, style: "success" },
  { text: "  typescript .............. OK", delay: 1500, style: "success" },
  { text: "", delay: 1600, style: "normal" },
  { text: "Mounting projects:", delay: 1700, style: "normal" },
  { text: "  /dev/balance ............ ACTIVE", delay: 1850, style: "cyan" },
  { text: "  /dev/b1-marketing ....... ACTIVE", delay: 2000, style: "cyan" },
  { text: "", delay: 2100, style: "normal" },
  { text: "> andrew.marich --role='full-stack engineer'", delay: 2200, style: "command" },
  { text: "", delay: 2400, style: "normal" },
  { text: "SYSTEM READY_", delay: 2500, style: "ready" },
] as const;

const TOTAL_DURATION = 3000;
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
  const [phase, setPhase] = useState<"boot" | "flash" | "done">("boot");
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
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
        }, line.delay),
      );
    });

    // Finish boot
    timers.push(setTimeout(finishBoot, TOTAL_DURATION));

    return () => timers.forEach(clearTimeout);
  }, [finishBoot]);

  if (skipBoot || phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center
                   bg-[var(--color-screen-void)] transition-opacity duration-300
                   ${phase === "flash" ? "opacity-0" : "opacity-100"}`}
      onClick={finishBoot}
      role="presentation"
    >
      <div className="max-w-xl w-full px-6">
        <pre
          className="font-[var(--font-mono)] text-xs sm:text-sm leading-relaxed select-none"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={getLineClass(line.style)}>
              {line.text}
            </div>
          ))}
        </pre>

        {/* Skip hint */}
        <p
          className="mt-8 text-center text-[var(--color-text-faint)] text-xs"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          click anywhere to skip
        </p>
      </div>
    </div>
  );
}
