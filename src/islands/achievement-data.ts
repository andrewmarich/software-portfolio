/**
 * Static achievement catalogue. Imported by Astro pages at build time and
 * passed down to the Achievements / AchievementNav islands as a prop so the
 * data ships with the HTML instead of a second client-side chunk request.
 */

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
