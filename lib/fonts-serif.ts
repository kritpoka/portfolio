import { Instrument_Serif } from "next/font/google";

/**
 * Display serif for case study and 404 titles. Lives in its own module and is
 * applied by app/work/layout.tsx, so it is only preloaded on those routes.
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});
