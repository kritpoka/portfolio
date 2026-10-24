@AGENTS.md

# Krit Poka — portfolio

**Positioning:** "Software engineer who designs — Flutter, Next.js, and the UX in between"

**Audience:** Thai tech companies and banks, and international / remote roles, equally. English only.

## Sources of truth
- **Layout, type, colour and copy:** the Claude Design project "Engineer's Notebook" (`Home.dc.html`, `Case*.dc.html`). Match it; don't restyle.
- **Facts:** `sources/notes/<slug>.md`, Krit's case study notes. Keep his facts exactly and edit only for flow. `SOURCES.md` indexes the other sources. Both are local only, never committed. If a fact isn't there, ask Krit.
- **Notes markers:**
  - `[ADD …]` / `[ASK KRIT …]`: keep a dashed chip in that section, or hide the section if it would be empty, and list it in the README.
  - Lines addressed to Krit ("Krit: confirm…") are questions, not site copy.
- **Placeholders:** every remaining one is listed in `README.md` → Content to add. Keep that list in sync when you add or fill one.

## Content rules
- **No photo** of Krit. **Never show GPA.** Never show the phone number.
- **Never invent** metrics, user counts, quotes, dates, team sizes or screenshots. Unknowns stay as `[PLACEHOLDER]` chips (`<Ph>` in MDX, or a `"[…]"` string in meta / `Outcome` / `Findings`).
- **ttb is confidential:**
  - Text and generic, self-drawn diagrams only.
  - No screenshots or product visuals.
  - No internal names beyond those already on the page.
  - Keep the note "Product details and visuals omitted under confidentiality."
- **Kasetfair POS accuracy** (checked in Supabase and the code):
  - Realtime is off: never say "real-time".
  - Products have no stock quantity: say "products" everywhere, never "stock" or "inventory". "The dashboard reflects every order" is accurate.
  - RLS: only signed-in staff can read or change data. Never say each vendor's data is isolated.
  - The stall was cancelled, so the dashboard screenshots are test data and never results.
- **KU Campus Map:** always use the full role, "Solo — product, design direction, data review and testing; code written with Claude Code (AI-assisted)". Never shorten it to "Solo".
- **Images:**
  - Don't use the KU Map landmark photos (other photographers).
  - Food photos in the POS screenshots come from other websites: they must stay blurred (see `POS_BLUR` in `scripts/optimize-images.mjs`).
- **Activities:** Krit was a working-group member, not an executive, in KU Tech club and KU Hackathon.
- **Never commit `sources/`:** the internship report and poster are internal, and the old resume has GPA and phone.

## Design tokens (`app/globals.css`)

| Token | Light | Dark (warm charcoal) |
|---|---|---|
| `--paper` | `#FAF9F6` | `#1E1D1A` |
| `--surface` | `#F1EFE9` | `#272622` |
| `--raise` | `#FFFFFF` | `#2C2B27` |
| `--ink` | `#1C1B18` | `#ECE9E2` |
| `--muted` | `#5C5950` | `#A9A498` |
| `--line` | `#E3DFD6` | `#3A3833` |
| `--dot` | `#D9D4C8` | `#36342E` |
| `--accent` | `#0B6A45` | `#7CCBA2` |
| `--accent-on-ink` | `#8FD3AE` | `#0B6A45` |

Tailwind exposes these as `bg-paper`, `text-ink`, `border-line`, `text-accent` and so on.

- **Theme:** light by default. It follows `prefers-color-scheme` until the toggle is used; the choice is stored in `localStorage.theme` and set as `data-theme` on `<html>` before first paint.
- **Fonts** (all through `next/font`):
  - IBM Plex Sans 400/500/600 for body and UI. Italic loads on demand, not preloaded.
  - IBM Plex Mono 400/500 for labels, metadata, buttons and chips.
  - Instrument Serif 400 for case study and 404 titles only. It's preloaded on `/work/*` only.
- **Type scale:**
  - Home: h1 48/1.05 at −0.025em, tagline 26/1.3, body 16/1.6.
  - Case: h1 64/1 serif (48 for long titles), lede 21/1.45, body 17/1.7, h2 24/1.3.
  - Labels: mono 12, uppercase, +0.08em.
- **Spacing:**
  - Text column max 680px with 24px side padding. Hero figures max 1040px.
  - Section gaps: 88px for home hero → work, then 80px between home sections; 56px between case sections.
  - Touch targets: at least 44px.
  - Radii: 8 (buttons), 12 (cards), 16 (hero figures), 999 (pills).
- **Motion:** one staggered page-load reveal: `[data-reveal]`, 560ms, 70ms stagger. Large hero text uses `reveal(i, "rise")` (no fade) so it counts as painted on the first frame (LCP). Everything respects `prefers-reduced-motion`.

## Case study template

Each project is `content/work/<slug>.mdx`:

1. `export const meta = { … }`, typed by `CaseMeta` in `lib/types.ts`:
   - slug, order, title, shortTitle, year, readTime, summary, description
   - role, team, timeline, stack, links
   - optional: linksNote, note, longTitle
   - A link without `href` renders as a dashed "[LINK]".
2. **Optional hero** (outside the text column): `<BrowserPhoneHero>`, `<PhonesHero>` or `<MapPreview>`. ttb has none.
3. **Numbered sections**, in this order: `<Section n="01" title="TL;DR" id="tldr">` and on. Hide a section rather than leave it empty, and renumber the rest.
   - TL;DR: three bullets
   - Context & problem
   - My role
   - Users & research, when there was research (Smart Dorm): text plus `<Findings items={[…]} />`
   - What it does / How I built it / What I built: project-specific, from the notes. Screenshots go here as `<Screenshot image alt caption />` or `<PhoneShots shots={[…]} />`, with images from `content/media.ts`.
   - Decisions & trade-offs: `<Decision title why />`, adding `options` and `choice` when they're known
   - Architecture: a diagram component from `components/diagrams`
   - Outcome: `<Outcome items={[{ value, label }]} />` for measured numbers, otherwise bullets
   - What I'd change
4. The page adds the header, the next-project card (in `order`, wrapping around), the footer, and analytics.

All template components are registered in `mdx-components.tsx`, so MDX files need no imports except media.

### Adding a project
1. Create `content/work/<slug>.mdx` following the template. Give it the next `order`.
2. Register it in `lib/work.ts`. That gives you static params, the command menu, the sitemap, the 404 list and the OG image.
3. If it should be featured on the homepage, add a row to `selectedWork` in `content/home.ts`. Otherwise add it to `moreProjects`.
4. Add a diagram component to `components/diagrams/index.tsx` and register it in `mdx-components.tsx`.
5. Add any placeholders to README → Content to add.
6. Run `npm run build`. It fails if a page stops being fully static.

## Interactions
- **⌘K / Ctrl+K command menu:**
  - Code: `components/command/`.
  - Built with cmdk and the Radix dialog, lazy-loaded on first open.
  - Commands: go to each case study, copy email, download resume, GitHub, LinkedIn, toggle theme.
- **Selected-work rows:** a hover / focus preview at 1360px and up with a fine pointer. Below that, or on touch, they show a "Preview ▾" toggle.
- **Copy email:** a button with a "Copied" toast and a live region.
- **KU Campus Map:** the iframe to ku-map-beta.vercel.app is created only after "Load interactive map", with Skip and Unload controls. Three.js never loads on this site's own bundles.
- **Analytics events** (`lib/analytics.ts`): `Resume click`, `Email copy`, `Email click`, `Case study open`.
