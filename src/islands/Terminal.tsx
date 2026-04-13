import { useState, useEffect, useRef, useCallback, type KeyboardEvent as ReactKeyboardEvent } from "react";

interface TerminalLine {
  type: "input" | "output" | "error" | "success";
  text: string;
}

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    "Available commands:",
    "",
    "  help          Show this message",
    "  about         About Andrew",
    "  skills        List tech skills",
    "  projects      List projects",
    "  contact       Contact info",
    "  whoami        Who are you?",
    "  clear         Clear terminal",
    "  neofetch      System info",
    "  exit          Close terminal",
    "",
    "Try typing something...",
  ],
  about: () => [
    "Andrew Marich",
    "Full-Stack Engineer | Gilbert, AZ",
    "",
    "Finance grad turned software engineer.",
    "CTO & Co-Founder at Balance.",
    "Building scalable systems by day,",
    "playing retro games by night.",
    "",
    "Sushi enthusiast. Hoops fan. Girl dad.",
  ],
  skills: () => [
    "FRONTEND:  React, TypeScript, Tailwind, HTMX, Astro",
    "BACKEND:   Python, Django, Node.js, PostgreSQL",
    "INFRA:     AWS, GCP, Cloudflare, Docker, Terraform",
    "TOOLS:     Git, Bun, CI/CD, Linear",
  ],
  projects: () => [
    "┌─────────────────────────────────────────────┐",
    "│ Balance          CTO & Co-Founder           │",
    "│ Medical A/R platform | React + Cloudflare   │",
    "│ 30% → 70% collections improvement           │",
    "├─────────────────────────────────────────────┤",
    "│ B1 Marketing     Full-Stack Engineer        │",
    "│ Lead routing system | Django + HTMX         │",
    "│ Enterprise-grade, HIPAA compliant           │",
    "├─────────────────────────────────────────────┤",
    "│ marich.dev       You're looking at it       │",
    "│ Portfolio | Astro + React islands            │",
    "│ Try the Konami code ;)                       │",
    "└─────────────────────────────────────────────┘",
  ],
  contact: () => [
    "Email:    andrew@marich.dev",
    "GitHub:   github.com/andrewmarich",
    "LinkedIn: linkedin.com/in/andrewmarich",
  ],
  whoami: () => ["visitor@marich.dev"],
  neofetch: () => [
    "        ╔══════╗       visitor@marich.dev",
    "        ║  AM  ║       ─────────────────",
    "        ╚══════╝       OS: marich.dev v1.0",
    "                       Framework: Astro 6",
    "                       UI: React 19 islands",
    "                       Style: Tailwind CSS 4",
    "                       Runtime: Bun",
    "                       Host: Cloudflare Pages",
    "                       Theme: Retro Dark",
    "                       Font: Outfit + Space Mono",
    "",
    "  ██ ██ ██ ██ ██ ██ ██ ██",
  ],
  "sudo rm -rf /": () => ["Permission denied. Nice try though."],
  ls: () => ["about/  projects/  experience/  skills/  contact/  .wallet/"],
  pwd: () => ["/home/visitor/marich.dev"],
  date: () => [new Date().toString()],
  echo: () => ["echo echo echo..."],
  "cd .wallet": () => ["drwxr-xr-x  seed.txt  private.key"],
  "cat .wallet/seed.txt": () => [
    "",
    "  RECOVERY PHRASE:",
    "  hodl moon rugpull silk road nft",
    "  ape bored yacht degen gm wagmi",
    "",
    "  BTC Balance: 0.00000000",
    "  ETH Balance: 0.00000000",
    "  NFTs: 1 (it's a screenshot of this terminal)",
    "",
  ],
  "cat .wallet/private.key": () => [
    "",
    "  -----BEGIN PRIVATE KEY-----",
    "  bm90LWEtcmVhbC1rZXktbmljZS10cnk=",
    "  -----END PRIVATE KEY-----",
    "",
    "  (that's base64 for 'not-a-real-key-nice-try')",
    "",
  ],
  "cat seed.txt": () => ["cat: seed.txt: No such file. Try: cat .wallet/seed.txt"],
  "": () => [],
};

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: 'marich.dev terminal v1.0 — type "help" for commands' },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    const newLines: TerminalLine[] = [
      { type: "input", text: `visitor@marich.dev:~$ ${cmd}` },
    ];

    if (trimmed === "clear") {
      setLines([
        { type: "output", text: 'Terminal cleared. Type "help" for commands.' },
        { type: "output", text: "" },
      ]);
      return;
    }

    if (trimmed === "exit") {
      setOpen(false);
      return;
    }

    const handler = COMMANDS[trimmed];
    if (handler) {
      handler().forEach((line) => {
        newLines.push({ type: "output", text: line });
      });
    } else {
      newLines.push({
        type: "error",
        text: `command not found: ${trimmed}. Try "help"`,
      });
    }

    newLines.push({ type: "output", text: "" });
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "`" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((prev) => {
          const next = !prev;
          if (next) {
            window.dispatchEvent(
              new CustomEvent("achievement", { detail: "terminal" }),
            );
          }
          return next;
        });
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleTrapFocus = useCallback((e: ReactKeyboardEvent) => {
    if (e.key !== "Tab") return;
    const first = closeRef.current;
    const last = inputRef.current;
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-terminal)] flex items-center justify-center p-4 sm:p-8" onKeyDown={handleTrapFocus}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Terminal window */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="relative w-full max-w-2xl rounded-lg border overflow-hidden
                    border-[var(--color-screen-raised)]
                    bg-[var(--color-screen-void)]
                    shadow-2xl shadow-black/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-screen-panel)] border-b border-[var(--color-screen-raised)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-neon-magenta)]/60" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-glow-primary)]/60" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-phosphor)]/60" />
          </div>
          <span className="text-[var(--color-text-faint)] text-xs">
            visitor@marich.dev
          </span>
          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            className="text-[var(--color-text-faint)] hover:text-[var(--color-text-bright)] text-xs"
          >
            ✕
          </button>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto p-4 text-sm leading-relaxed"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.type === "input"
                  ? "text-[var(--color-glow-primary)]"
                  : line.type === "error"
                    ? "text-[var(--color-neon-magenta)]"
                    : line.type === "success"
                      ? "text-[var(--color-phosphor)]"
                      : "text-[var(--color-text-muted)]"
              }
            >
              {line.text || "\u00A0"}
            </div>
          ))}

          {/* Input line */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-glow-primary)] shrink-0">
              visitor@marich.dev:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  executeCommand(input);
                  setInput("");
                }
              }}
              className="flex-1 bg-transparent text-[var(--color-text-bright)] outline-none
                         caret-[var(--color-glow-primary)]"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Hint bar */}
        <div className="px-4 py-1.5 bg-[var(--color-screen-panel)] border-t border-[var(--color-screen-raised)]">
          <span
            className="text-[var(--color-text-faint)] text-[7px] tracking-wider uppercase"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            Ctrl+` to toggle • type "help" for commands
          </span>
        </div>
      </div>
    </div>
  );
}
