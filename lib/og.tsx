import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

// Shared Open Graph card (1200×630) for LINE, LinkedIn and Slack previews.
// Light theme tokens from the design; fonts vendored in lib/og-fonts.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Literal paths so output file tracing bundles the fonts with the image routes.
async function loadFonts() {
  "use cache";
  cacheLife("max");
  const dir = join(process.cwd(), "lib/og-fonts");
  const [sans400, sans500, mono500, serif400] = await Promise.all([
    readFile(join(dir, "ibm-plex-sans-latin-400-normal.woff")),
    readFile(join(dir, "ibm-plex-sans-latin-500-normal.woff")),
    readFile(join(dir, "ibm-plex-mono-latin-500-normal.woff")),
    readFile(join(dir, "instrument-serif-latin-400-normal.woff")),
  ]);
  return [
    { name: "Plex Sans", data: new Uint8Array(sans400).buffer, weight: 400 as const, style: "normal" as const },
    { name: "Plex Sans", data: new Uint8Array(sans500).buffer, weight: 500 as const, style: "normal" as const },
    { name: "Plex Mono", data: new Uint8Array(mono500).buffer, weight: 500 as const, style: "normal" as const },
    { name: "Instrument Serif", data: new Uint8Array(serif400).buffer, weight: 400 as const, style: "normal" as const },
  ];
}

const C = { paper: "#FAF9F6", ink: "#1C1B18", muted: "#5C5950", line: "#E3DFD6", dot: "#D9D4C8", accent: "#0B6A45" };

type Card = {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Case studies use the display serif for the title, like the page. */
  serif?: boolean;
};

export async function renderOgImage({ eyebrow, title, subtitle, serif = false }: Card) {
  const titleSize = serif ? (title.length > 40 ? 68 : 96) : 88;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: C.paper,
          backgroundImage: `radial-gradient(${C.dot} 1.5px, transparent 1.8px)`,
          backgroundSize: "28px 28px",
          color: C.ink,
          fontFamily: "Plex Sans",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Plex Mono", fontSize: 26 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              border: `2px solid ${C.ink}`,
              borderRadius: 12,
              background: C.paper,
              fontSize: 20,
            }}
          >
            KP
          </div>
          <span style={{ background: C.paper, padding: "0 6px" }}>krit.poka</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, background: C.paper, padding: "8px 0" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Plex Mono",
              fontSize: 22,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.muted,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: serif ? "Instrument Serif" : "Plex Sans",
              fontWeight: serif ? 400 : 500,
              fontSize: titleSize,
              lineHeight: 1.04,
              letterSpacing: serif ? "-0.01em" : "-0.025em",
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 32, lineHeight: 1.35, maxWidth: 1000, color: C.ink }}>{subtitle}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "Plex Mono",
            fontSize: 22,
            color: C.muted,
            borderTop: `2px solid ${C.line}`,
            paddingTop: 24,
            background: C.paper,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: C.accent }} />
          Software engineer who designs · Flutter · Next.js · UX
        </div>
      </div>
    ),
    { ...ogSize, fonts: await loadFonts() },
  );
}
