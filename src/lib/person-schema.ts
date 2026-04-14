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
    "Full-stack engineer specializing in cloud infrastructure, internal tooling, and user interfaces. CTO & Co-Founder of Balance.",
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
    name: "B1 Marketing Group",
  },
  knowsAbout: [
    "Full-Stack Development",
    "React",
    "TypeScript",
    "Python",
    "Django",
    "Cloud Infrastructure",
    "Cloudflare Workers",
    "AWS",
    "GCP",
    "System Architecture",
  ],
} as const;
