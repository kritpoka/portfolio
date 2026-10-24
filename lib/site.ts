// Single source for links, contact details and the canonical URL.

export const NAME = "Krit Poka";
export const EMAIL = "kritpoka@gmail.com";
export const RESUME_PATH = "/resume.pdf";

export const LINKS = {
  github: "https://github.com/kritpoka",
  linkedin: "https://www.linkedin.com/in/krit-poka-386b47291",
  email: `mailto:${EMAIL}`,
  ku: "https://www.ku.ac.th/en",
  kuMap: "https://ku-map-beta.vercel.app",
  kuMapCode: "https://github.com/kritpoka/ku-bangkhen-campus-map",
  kasetfairPos: "https://ku-media-pos.vercel.app",
  kasetfairPosCode: "https://github.com/kritpoka/ku-media-pos",
  studyCafe: "https://study-cafe-chi.vercel.app",
  kuMedia: "https://github.com/kritpoka/ku-media",
  qwiksell: "https://github.com/krafter-labs/qwiksell",
} as const;

export const DEFAULT_DESCRIPTION =
  "Krit Poka — software engineer who designs. Flutter, Next.js and UX. Kasetsart University Computer Science, Bangkok.";

/**
 * Canonical origin, e.g. "https://kritpoka.com". Leave SITE_URL unset until a
 * custom domain is connected; Vercel's production URL is used instead.
 */
export const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const BUILD_DATE = new Date(process.env.BUILD_DATE ?? 0).toLocaleDateString(
  "en-GB",
  { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" },
);
