"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { PENDING_CLASS } from "./boot";
import { buildIntro as cfg, type Step } from "./config";

gsap.registerPlugin(useGSAP, SplitText);

export type StageProps = { onDone: () => void };

type Rect = { x: number; y: number; w: number; h: number };
type Target = { el: HTMLElement; step: Step; rect: Rect; onScreen: boolean };

const mobileQuery = `(max-width: ${cfg.mobileMaxWidth}px)`;
const HANDLES = [0, 0.5, 1].flatMap((fx) => [0, 0.5, 1].map((fy) => [fx, fy])).filter(([fx, fy]) => fx !== 0.5 || fy !== 0.5);
/** The selection frame sits this far inside its wrapper, leaving room for the handles. */
const PAD = 4;

/* ── Helpers ──────────────────────────────────────────────────────────── */

/** Every marked element (or its children), measured in document coordinates. */
function collectTargets(): Target[] {
  const vh = window.innerHeight;
  const sy = window.scrollY;
  const out: Target[] = [];
  for (const step of cfg.steps) {
    for (const marked of document.querySelectorAll<HTMLElement>(`[data-build="${step.build}"]`)) {
      const els = step.children ? (Array.from(marked.children) as HTMLElement[]) : [marked];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        out.push({ el, step, rect: { x: r.left, y: r.top + sy, w: r.width, h: r.height }, onScreen: r.bottom > 0 && r.top < vh });
      }
    }
  }
  return out;
}

function luminance(color: string) {
  const m = color.match(/[\d.]+/g);
  if (!m || m.length < 3) return null;
  const [r, g, b, a = "1"] = m;
  if (Number(a) < 0.9) return null;
  const lin = (c: string) => {
    const v = Number(c) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** A dark or coloured panel: opaque background far from the page's own. */
function isPanel(el: HTMLElement) {
  const own = luminance(getComputedStyle(el).backgroundColor);
  const page = luminance(getComputedStyle(document.body).backgroundColor);
  return own !== null && page !== null && Math.abs(own - page) > 0.3;
}

const rand = gsap.utils.random;

/* ── Component ────────────────────────────────────────────────────────── */

export default function Stage({ onDone }: StageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const cursorRefs = useRef<{ outer: HTMLDivElement | null; inner: HTMLDivElement | null }[]>([]);
  const boxRefs = useRef<{ wrap: HTMLDivElement | null; badge: HTMLDivElement | null; text: HTMLSpanElement | null }[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const seekRef = useRef(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const [isMobile, setIsMobile] = useState(() => window.matchMedia(mobileQuery).matches);
  const [speed, setSpeed] = useState(cfg.speeds[0]);
  const [buildKey, setBuildKey] = useState(0);
  const agents = cfg.agents.slice(0, isMobile ? cfg.cursors.mobile : cfg.cursors.desktop);
  const timeScale = speed * (isMobile ? cfg.mobileTimeScale : 1);

  // Build (and rebuild on resize or replay) the whole timeline. revertOnUpdate
  // restores the page to its natural state before each rebuild, and on unmount.
  useGSAP(
    (_ctx, contextSafe) => {
      const world = worldRef.current;
      const bar = barRef.current;
      if (!world || !bar || !contextSafe) return;
      const T = cfg.timing;
      const E = cfg.ease;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sy = window.scrollY;

      // The page's CSS load reveal must not restart when the pending class goes.
      // Set outside GSAP on purpose, so reverting the context leaves it in place.
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => (el.style.animation = "none"));

      // Read every rect first, then write.
      const targets = collectTargets();
      const panels = new Set(targets.filter((t) => t.step.reveal === "pop" && isPanel(t.el)).map((t) => t.el));
      const visible = targets.filter((t) => t.onScreen);

      // Hand over from the pre-paint class to inline styles, in the same frame.
      gsap.set(
        visible.map((t) => t.el),
        { opacity: 0 },
      );
      window.clearTimeout(window.__buildIntroFailsafe);
      document.documentElement.classList.remove(PENDING_CLASS);

      // Overlay follows the page if the visitor scrolls mid-build.
      const syncScroll = () => gsap.set(world, { y: -window.scrollY });
      syncScroll();
      window.addEventListener("scroll", syncScroll, { passive: true });

      const cursors = cursorRefs.current.slice(0, agents.length);
      const boxes = boxRefs.current.slice(0, agents.length);
      const clampX = (x: number) => gsap.utils.clamp(8, vw - 72, x);
      const clampY = (y: number) => gsap.utils.clamp(sy + 24, sy + vh - 96, y);
      const restPoint = () => ({ x: clampX(rand(vw * 0.08, vw * 0.92)), y: clampY(sy + rand(vh * 0.1, vh * 0.85)) });

      // Idle wobble on the inner layer; the timeline moves the outer layer.
      const wobbles = cursors.map(({ inner }) =>
        gsap.to(inner, {
          x: "random(-9, 9)",
          y: "random(-7, 7)",
          duration: "random(1.1, 2)",
          ease: "sine.inOut",
          repeat: -1,
          repeatRefresh: true,
        }),
      );
      const holdStill = contextSafe((c: number) => {
        wobbles[c]?.pause();
        gsap.to(cursors[c].inner, { x: 0, y: 0, duration: 0.15, ease: "power2.out" });
      });
      const letDrift = contextSafe((c: number) => wobbles[c]?.invalidate().restart());

      const done = contextSafe(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        onDoneRef.current();
      });

      const revealTimes: number[] = [];
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: E.reveal },
        onUpdate: () => {
          const t = tl.time();
          const n = revealTimes.reduce((acc, at) => acc + (at <= t ? 1 : 0), 0);
          if (countRef.current) countRef.current.textContent = String(n);
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${tl.progress()})`;
        },
        onComplete: done,
      });
      tlRef.current = tl;

      // Status bar and cursors arrive.
      tl.fromTo(bar, { yPercent: 160, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }, 0);
      cursors.forEach(({ outer }) => {
        const p = restPoint();
        gsap.set(outer, { x: p.x, y: p.y, transformOrigin: "0 0" });
      });
      tl.fromTo(
        cursors.map((c) => c.outer),
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: T.enter, stagger: 0.03, ease: "back.out(2)" },
        0,
      );

      /* Reveal one element at `at`. */
      const reveal = (t: Target, at: number) => {
        const el = t.el;
        const kind = t.step.reveal;
        if (kind === "canvas") {
          tl.to(el, { opacity: 1, duration: 0.6, ease: "power1.out" }, at);
        } else if (kind === "fadeUp") {
          tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: T.reveal }, at);
        } else if (kind === "pop" && panels.has(el)) {
          // Panel: the background lands first, then its contents build inside.
          const split = SplitText.create(el, { type: "words", tag: "span", aria: "none" });
          tl.fromTo(el, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: T.reveal * 0.8 }, at);
          tl.fromTo(split.words, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 }, at + 0.16);
        } else if (kind === "pop") {
          tl.fromTo(el, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: T.reveal }, at);
        } else if (kind === "lines") {
          const split = SplitText.create(el, { type: "lines", tag: "span", aria: "none" });
          tl.set(el, { opacity: 1 }, at);
          tl.fromTo(split.lines, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: T.reveal, stagger: 0.09 }, at);
        } else if (kind === "wipe") {
          tl.set(el, { opacity: 1 }, at);
          tl.fromTo(
            el,
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: T.reveal * 1.3, ease: "power3.out" },
            at,
          );
          // Unclip right away so descenders aren't cut off for the rest of the intro.
          tl.set(el, { clearProps: "clipPath" }, at + T.reveal * 1.3);
        } else if (kind === "type") {
          const split = SplitText.create(el, { type: "words,chars", tag: "span", aria: "none" });
          tl.set(el, { opacity: 1 }, at);
          tl.fromTo(
            split.chars,
            { opacity: 0 },
            { opacity: 1, duration: 0.01, ease: "none", stagger: (T.reveal * 1.4) / Math.max(1, split.chars.length) },
            at,
          );
        }
      };

      /* Cursor c flies to the target, drags a selection box over it, lets go. */
      const select = (c: number, t: Target, at: number, revealAt: number) => {
        const { outer } = cursors[c];
        const { wrap, badge, text } = boxes[c];
        const r = t.rect;
        const dragAt = at + T.fly;
        const below = r.y + r.h + 30 < sy + vh - 64;
        const size = { w: 0, h: 0 };
        const label = () => {
          if (text) text.textContent = `${Math.round(size.w)} × ${Math.round(size.h)}`;
        };

        tl.call(holdStill, [c], at);
        tl.to(outer, { x: r.x, y: r.y, duration: T.fly, ease: E.fly }, at);

        tl.set(wrap, { x: r.x - PAD, y: r.y - PAD, width: r.w + PAD * 2, height: r.h + PAD * 2, opacity: 1, clipPath: "inset(0% 100% 100% 0%)" }, dragAt);
        tl.to(wrap, { clipPath: "inset(0% 0% 0% 0%)", duration: T.drag, ease: E.drag }, dragAt);
        tl.to(outer, { x: r.x + r.w, y: r.y + r.h, duration: T.drag, ease: E.drag }, dragAt);

        tl.set(badge, { x: gsap.utils.clamp(48, vw - 48, r.x + r.w / 2), y: below ? r.y + r.h + 8 : r.y - 26, xPercent: -50 }, dragAt);
        tl.fromTo(badge, { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: false }, dragAt);
        tl.fromTo(size, { w: 0, h: 0 }, { w: r.w, h: r.h, duration: T.drag, ease: E.drag, onUpdate: label, immediateRender: false }, dragAt);

        const release = revealAt + T.hold;
        tl.to([wrap, badge], { opacity: 0, duration: 0.2, ease: "power1.out" }, release);
        tl.to(outer, { x: clampX(r.x + r.w + rand(12, 48)), y: clampY(r.y + r.h + rand(8, 36)), duration: 0.45, ease: "power2.out" }, release);
        tl.call(letDrift, [c], release + 0.45);
      };

      // Schedule: each step starts `after` seconds after the previous one.
      // A cursor works on one layer at a time; if none is free, the layer just reveals.
      const busy = cursors.map(() => -Infinity);
      let stepAt = 0;
      let lastReveal = 0;
      for (const step of cfg.steps) {
        stepAt += step.after;
        const wantsCursor = step.cursor !== false && !(isMobile && step.mobileCursor === false);
        targets
          .filter((t) => t.step === step)
          .forEach((t, i) => {
            if (!t.onScreen) {
              revealTimes.push(0); // below the fold: already there
              return;
            }
            let at = stepAt + i * (step.stagger ?? 0.08);
            let c = -1;
            if (wantsCursor && cursors.length) {
              c = busy.indexOf(Math.min(...busy));
              const wait = busy[c] - at;
              if (wait > 0.25) c = -1;
              else at += Math.max(0, wait);
            }
            const revealAt = c >= 0 ? at + T.fly + T.drag * 0.75 : step.cursor === false ? at : at + T.fly;
            if (c >= 0) {
              select(c, t, at, revealAt);
              busy[c] = revealAt + T.hold + 0.3;
            }
            reveal(t, revealAt);
            revealTimes.push(revealAt);
            lastReveal = Math.max(lastReveal, revealAt + T.reveal);
          });
      }
      if (totalRef.current) totalRef.current.textContent = String(revealTimes.length);

      // Outro: the bar slides away and the cursors fade out.
      const end = lastReveal + 0.15;
      tl.to(bar, { yPercent: 160, opacity: 0, duration: cfg.timing.outro, ease: "power2.in" }, end);
      tl.to(
        cursors.map((c) => c.outer),
        { opacity: 0, scale: 0.8, duration: cfg.timing.outro * 0.8, ease: "power1.in" },
        end,
      );

      tl.timeScale(timeScale).time(seekRef.current).play();

      return () => {
        window.removeEventListener("scroll", syncScroll);
        tlRef.current = null;
      };
    },
    { dependencies: [buildKey, isMobile], revertOnUpdate: true, scope: rootRef },
  );

  // Speed changes apply to the running timeline without a rebuild.
  useEffect(() => {
    tlRef.current?.timeScale(timeScale);
  }, [timeScale]);

  // Jump to the end (onComplete then hands back to the page).
  const skip = useCallback(() => {
    const tl = tlRef.current;
    if (tl) tl.progress(1);
    else onDoneRef.current();
  }, []);

  const replay = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    seekRef.current = 0;
    setBuildKey((k) => k + 1);
  };

  // Esc skips; so does tabbing into the page, so keyboard users never land on a hidden element.
  // Resizing rebuilds at the same point in time with fresh rects.
  useEffect(() => {
    let lastWidth = window.innerWidth;
    let timer = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    const onFocus = (e: FocusEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) skip();
    };
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (window.innerWidth === lastWidth) return; // mobile URL bar: height only
        lastWidth = window.innerWidth;
        seekRef.current = tlRef.current?.time() ?? 0;
        setIsMobile(window.matchMedia(mobileQuery).matches);
        setBuildKey((k) => k + 1);
      }, 150);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener("resize", onResize);
    };
  }, [skip]);

  const { selection, bar, barText, barMuted } = cfg.colors;
  const barButton =
    "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent px-2.5 font-mono text-xs leading-none font-medium hover:bg-white/10";

  return createPortal(
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      <div ref={worldRef} aria-hidden="true" className="absolute top-0 left-0 h-0 w-full will-change-transform">
        {agents.map((a, i) => (
          <div key={a.name}>
            <div
              ref={(el) => {
                boxRefs.current[i] = { ...boxRefs.current[i], wrap: el };
              }}
              className="absolute top-0 left-0 opacity-0"
            >
              <div className="absolute border border-solid" style={{ inset: PAD, borderColor: selection }} />
              {HANDLES.map(([fx, fy]) => (
                <span
                  key={`${fx}-${fy}`}
                  className="absolute size-1.5 border border-solid bg-white"
                  style={{
                    borderColor: selection,
                    left: `calc(${PAD}px + (100% - ${PAD * 2}px) * ${fx} - 3px)`,
                    top: `calc(${PAD}px + (100% - ${PAD * 2}px) * ${fy} - 3px)`,
                  }}
                />
              ))}
            </div>
            <div
              ref={(el) => {
                boxRefs.current[i] = { ...boxRefs.current[i], badge: el };
              }}
              className="absolute top-0 left-0 rounded-[3px] px-1.5 py-[3px] font-mono text-[11px] leading-none whitespace-nowrap text-white tabular-nums opacity-0"
              style={{ background: selection }}
            >
              <span
                ref={(el) => {
                  boxRefs.current[i] = { ...boxRefs.current[i], text: el };
                }}
              >
                0 × 0
              </span>
            </div>
          </div>
        ))}
        {agents.map((a, i) => (
          <div
            key={a.name}
            ref={(el) => {
              cursorRefs.current[i] = { ...cursorRefs.current[i], outer: el };
            }}
            className="absolute top-0 left-0 opacity-0 will-change-transform"
          >
            <div
              ref={(el) => {
                cursorRefs.current[i] = { ...cursorRefs.current[i], inner: el };
              }}
            >
              <svg width="18" height="20" viewBox="0 0 18 20" className="-mt-px -ml-px block overflow-visible">
                <path
                  d="M1 1 L1 15.5 L4.9 11.9 L7.6 18 L10.3 16.8 L7.7 10.9 L13 10.6 Z"
                  fill={a.color}
                  stroke="#fff"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="absolute top-[17px] left-[11px] rounded-full px-1.5 py-[3px] font-mono text-[11px] leading-none font-medium whitespace-nowrap text-white"
                style={{ background: a.color }}
              >
                {a.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        ref={barRef}
        role="group"
        aria-label="Build intro"
        className="pointer-events-auto fixed bottom-4 left-4 flex max-w-[calc(100vw-32px)] items-center gap-2.5 rounded-full py-0 pr-1 pl-3.5 font-mono text-xs leading-none shadow-card opacity-0 max-[767px]:gap-1.5 max-[767px]:pl-3"
        style={{ background: bar, color: barText, marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <span aria-hidden="true" className="flex">
          {agents.map((a, i) => (
            <span
              key={a.name}
              className="size-2.5 rounded-full"
              style={{ background: a.color, boxShadow: `0 0 0 2px ${bar}`, marginLeft: i ? -3 : 0 }}
            />
          ))}
        </span>
        <span aria-hidden="true" className="whitespace-nowrap max-[767px]:hidden">
          {agents.length} agents
        </span>
        <span aria-hidden="true" className="whitespace-nowrap tabular-nums" style={{ color: barMuted }}>
          <span ref={countRef} style={{ color: barText }}>
            0
          </span>{" "}
          / <span ref={totalRef}>0</span> <span className="max-[400px]:hidden">layers</span>
        </span>
        <span aria-hidden="true" className="relative h-[2px] w-12 overflow-hidden rounded-full bg-white/15 max-[767px]:w-8">
          <span ref={fillRef} className="absolute inset-0 origin-left" style={{ background: selection, transform: "scaleX(0)" }} />
        </span>
        <span className="flex items-center">
          <button type="button" onClick={replay} className={barButton} style={{ color: barText }} aria-label="Tour: replay the build intro">
            Tour
          </button>
          <button
            type="button"
            onClick={() => setSpeed((s) => cfg.speeds[(cfg.speeds.indexOf(s) + 1) % cfg.speeds.length])}
            className={barButton}
            style={{ color: barText }}
            aria-label={`Speed ${speed}×, change speed`}
          >
            {speed}×
          </button>
          <button type="button" onClick={skip} className={barButton} style={{ color: barText }} aria-label="Skip the build intro">
            ✕
          </button>
        </span>
      </div>
    </div>,
    document.body,
  );
}
