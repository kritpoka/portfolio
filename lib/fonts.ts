import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

// next/font self-hosts these and generates metric-matched fallbacks, so text
// doesn't shift when the web font arrives.

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

/**
 * Italic is used for one short line (the ttb note), so it loads on demand
 * instead of being preloaded. Same family name, so `italic` picks it up.
 */
export const plexSansItalic = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-plex-sans-italic",
  display: "swap",
  preload: false,
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
