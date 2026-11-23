/**
 * "Live AI build" homepage intro: everything you might want to tune.
 *
 * Targets are marked in app/page.tsx with data-build="N". Each step below
 * builds every element with that N, in parallel. A purely scripted animation;
 * nothing here calls an AI.
 *
 * Turn the intro off: set `enabled` to false. The homepage then renders as
 * before and the GSAP chunk is never downloaded.
 */

export type Reveal =
  /** Plain fade, no cursor needed (background layers). */
  | "canvas"
  /** Buttons and cards: scale 0.96 → 1 + fade. Dark or coloured elements are
   *  detected automatically and get the panel reveal: background first, then
   *  their contents. */
  | "pop"
  /** Short text: fade up. */
  | "fadeUp"
  /** Paragraphs: line-by-line fade up (SplitText, reverted afterwards). */
  | "lines"
  /** Big headings: clip-path wipe, left to right. */
  | "wipe"
  /** Big headings: per-character type-in (SplitText, reverted afterwards). */
  | "type";

export type Step = {
  /** Matches data-build="N" in the markup. */
  build: number;
  reveal: Reveal;
  /** Seconds after the previous step starts (GSAP position parameter). */
  after: number;
  /** Build each child of the marked element as its own layer (lists, button rows). */
  children?: boolean;
  /** Seconds between parallel layers in this step. */
  stagger?: number;
  /** false: no cursor or selection box, just the reveal. */
  cursor?: boolean;
  /** false: on phones, reveal without a cursor (shorter sequence). */
  mobileCursor?: boolean;
};

export const buildIntro = {
  enabled: false,
  /** localStorage key. Once set, later visits skip straight to the finished page. */
  storageKey: "build-intro-seen",
  /** The page is shown anyway if the intro hasn't started by then (slow or failed JS). */
  failsafeMs: 3000,
  /** Below this width: fewer cursors, phone-sized status bar. */
  mobileMaxWidth: 767,

  agents: [
    { name: "Layout", color: "#E5484D" },
    { name: "Type", color: "#8E4EC6" },
    { name: "Color", color: "#12A594" },
    { name: "Motion", color: "#0B7FD6" },
    { name: "Grid", color: "#E2620E" },
    { name: "Copy", color: "#D6409F" },
    { name: "Spacing", color: "#3E63DD" },
    { name: "A11y", color: "#2B9A66" },
    { name: "Icons", color: "#A07553" },
    { name: "QA", color: "#6E56CF" },
  ],
  /** How many of the agents above are on screen. */
  cursors: { desktop: 10, mobile: 4 },

  /** Build order. Same `build` number = same step = built in parallel. */
  steps: [
    { build: 0, reveal: "canvas", after: 0, cursor: false },
    { build: 1, reveal: "pop", after: 0.1 },
    { build: 2, reveal: "fadeUp", after: 0.28 },
    { build: 3, reveal: "wipe", after: 0.25 },
    { build: 4, reveal: "lines", after: 0.28 },
    { build: 5, reveal: "fadeUp", after: 0.28, mobileCursor: false },
    { build: 6, reveal: "pop", after: 0.22, children: true, stagger: 0.09 },
    { build: 7, reveal: "wipe", after: 0.3, mobileCursor: false },
    { build: 8, reveal: "pop", after: 0.22, children: true, stagger: 0.12 },
  ] satisfies Step[] as Step[],

  /** Seconds at 1×. The whole intro runs about 3.5 s. */
  timing: {
    /** Cursor flight to the target's top-left corner. */
    fly: 0.42,
    /** Selection box "drag" to the bottom-right corner. */
    drag: 0.3,
    /** The element's own reveal. */
    reveal: 0.45,
    /** Selection box lingers this long after the reveal starts. */
    hold: 0.3,
    /** Cursors fade in at the start. */
    enter: 0.35,
    /** Status bar slide-away and cursor fade at the end. */
    outro: 0.45,
  },
  /** Playback speeds offered by the 1× / 2× button. */
  speeds: [1, 2],
  /** Phones play a bit faster on top of the chosen speed. */
  mobileTimeScale: 1.2,

  ease: {
    /** Spring-like flight with a little overshoot. */
    fly: "back.out(1.5)",
    drag: "power2.out",
    reveal: "power3.out",
  },

  colors: {
    /** Figma-style selection blue for the box, handles and size badge. */
    selection: "#0D99FF",
    /** Dark status bar and Tour pill. Fixed so it reads the same in both themes. */
    bar: "#1C1B18",
    barText: "#ECE9E2",
    barMuted: "#A9A498",
  },
};

export type BuildIntroConfig = typeof buildIntro;
