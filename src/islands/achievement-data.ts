export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-visit",
    title: "A New Save File",
    description: "Arrived at marich.dev",
    icon: "💾",
  },
  {
    id: "scroll-bottom",
    title: "Completionist",
    description: "Reached the bottom of the page",
    icon: "🏆",
  },
  {
    id: "konami",
    title: "Cheat Code",
    description: "↑↑↓↓←→←→BA",
    icon: "🎮",
  },
  {
    id: "terminal",
    title: "Sequence Break",
    description: "Opened the hidden terminal",
    icon: "💻",
  },
  {
    id: "contact-click",
    title: "Side Quest",
    description: "Clicked a contact link",
    icon: "📜",
  },
  {
    id: "idle-60",
    title: "Idle Animation",
    description: "Stayed for over 60 seconds",
    icon: "🕐",
  },
  {
    id: "return-visit",
    title: "New Game+",
    description: "Returned to the site",
    icon: "🔄",
  },
];

export const STORAGE_KEY = "marich-achievements";

export function getUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveUnlocked(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {}
}
