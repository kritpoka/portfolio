import { Instrument_Serif } from "next/font/google";

/**
 * Same face as lib/fonts-serif.ts for the root 404 page. Kept in its own
 * module with preload off, so it isn't preloaded on every route.
 */
export const instrumentSerifLazy = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
});
