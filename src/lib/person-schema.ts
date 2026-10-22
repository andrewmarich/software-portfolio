/**
 * JSON-LD Person schema for SEO. Tells search engines (and AI agents) who
 * this site represents, with structured links to social profiles and
 * educational background.
 *
 * https://schema.org/Person
 */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Andrew Marich",
  alternateName: "marich",
  jobTitle: "Full-Stack Engineer",
  description:
    "Full-stack engineer who builds products and leads the engineering behind them. Co-Founder & CTO of Balance Health.",
  url: "https://marich.dev",
  email: "mailto:andrew@marich.dev",
  image: "https://marich.dev/images/profile.webp",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gilbert",
    addressRegion: "AZ",
    addressCountry: "US",
  },
  sameAs: ["https://github.com/andrewmarich", "https://linkedin.com/in/andrewmarich"],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Western Governors University" },
    { "@type": "CollegeOrUniversity", name: "University of Arizona" },
  ],
  worksFor: {
    "@type": "Organization",
    name: "Balance Health",
  },
  knowsAbout: [
    "Full-Stack Development",
    "React",
    "TypeScript",
    "Python",
    "Django",
    "Cloud Infrastructure",
    "AWS",
    "Google Cloud",
    "Terraform",
    "HTMX",
    "System Architecture",
  ],
} as const;
