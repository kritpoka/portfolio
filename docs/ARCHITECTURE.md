# Architecture

How this site is put together, and why. Written so that you can come back after months away and find your way around. The short version is in the [README](../README.md); content and design rules are in [CLAUDE.md](../CLAUDE.md), which stays the source of truth for them.

**Contents:** [Big picture](#1-big-picture) · [How a page gets built](#2-how-a-page-gets-built) · [Components](#3-components) · [Design system](#4-design-system) · [Images and media](#5-images-and-media) · [SEO and share previews](#6-seo-and-share-previews) · [Performance](#7-performance) · [Accessibility](#8-accessibility) · [Content rules](#9-content-rules) · [Walkthroughs](#10-walkthroughs) · [Decision log](#11-decision-log) · [Glossary](#12-glossary) · [Files to read first](#13-five-files-to-read-first)

---

## 1. Big picture

Everything is decided at build time. There is no database and no API: content is files in the repo, and the output is static HTML plus a little client JavaScript.

```
 content/work/*.mdx ─┐                                   ┌─► / (home)
 content/home.ts ────┤                                   ├─► /work/<slug> × 4
 content/media.ts ───┤   lib/work.ts      app/ routes    ├─► /opengraph-image, /work/<slug>/opengraph-image
 lib/site.ts ────────┴─► (registry) ───► generateStaticParams ─► next build ─┼─► /sitemap.xml, /robots.txt
 components/ + mdx-components.tsx ─────► render the MDX                      └─► /icon.svg, /apple-icon, 404
                                                                     │
                                                          static HTML + JS chunks
                                                                     │
                                                                  Vercel (CDN)
```

- **Content** (`content/`) holds the words and the image metadata.
- **`lib/`** holds the registry (`work.ts`), site constants (`site.ts`), the share-image renderer (`og.tsx`), theme and font setup.
- **`app/`** holds the routes. Each route reads from `lib/` and renders components.
- **Output** is prerendered HTML. The only client-side JavaScript is interactive bits: theme toggle, command menu, project row toggles, copy-email, click-to-load map, analytics.

---

## 2. How a page gets built

### A case study, end to end

1. **The file.** `content/work/<slug>.mdx` exports `meta` (typed by `CaseMeta` in `lib/types.ts`) and a body made of `<Section>`, `<Decision>`, `<Outcome>` and similar components. MDX files need no imports except `media` for images.
2. **The registry.** `lib/work.ts` imports each MDX file (`Content`) and its `meta`, sorts them by `meta.order`, and exports:
   - `caseStudies`: the sorted list
   - `getCaseStudy(slug)`
   - `getNextCaseStudy(slug)`: the next one, wrapping from last to first
   - `caseLinks`: plain data for client components (the command menu)
3. **The route.** `app/work/[slug]/page.tsx`:
   - `generateStaticParams()` returns one param per entry in `caseStudies`, so every slug is prerendered.
   - `generateMetadata()` sets the title, description, canonical link and Open Graph fields from `meta`.
   - The page renders `CaseNav`, `CaseHeader`, the MDX `<Content />`, the next-project card and `CaseFooter`. Unknown slugs call `notFound()`.
4. **The components.** `@next/mdx` looks up components through `useMDXComponents()` in `mdx-components.tsx`. That file registers the Markdown element styles (`p`, `ul`, `h3`, …) and every template component, which is why MDX files can use `<Section>` without importing it.

`next.config.ts` wires MDX in (`createMDX`) and lists `mdx` in `pageExtensions`.

### The static-only rule

Two settings keep every route prerendered:

- `cacheComponents: true` in `next.config.ts` turns on Cache Components. Anything that reads at request time or does uncached I/O has to be explicitly cached or wrapped in `<Suspense>`; otherwise it can't be prerendered.
- `export const ensureStatic = "navigation"` in `app/layout.tsx`. Per the Next.js docs it reports an error when request-specific server work prevents a route from being prerendered, so `npm run build` fails instead of silently shipping a dynamic page.

Things that would break it: reading `cookies()`, `headers()` or `searchParams` in a page, or reading files or fetching data in a route without `"use cache"`. This already happened once: `lib/og.tsx` read font files on every render, which made the share-image routes dynamic. Wrapping `loadFonts()` in `"use cache"` with `cacheLife("max")` fixed it, and the fonts are vendored in `lib/og-fonts/` with literal paths so build tracing includes them.

The build table (`npm run build`) shows `○` or `●` next to every page. A `ƒ` means a route went dynamic and needs fixing.

---

## 3. Components

### Case study building blocks: `components/case/`

| Component | Role |
|---|---|
| `Blocks.tsx` | `Section` (numbered, labelled `<section>`), `Findings` (F1, F2 rows), `Decision` (title, optional options and choice, why), `Outcome` (measured numbers or text). |
| `CaseHeader.tsx` | The page header from `meta`: title, summary, role, timeline, stack, links, optional note. A link without `href` renders as a dashed `[LINK]` chip. |
| `CaseChrome.tsx` | `CaseNav` (back link, "Case study n / 4", theme toggle), `NextProject`, `CaseFooter`. |
| `Heroes.tsx` | `BrowserPhoneHero` and `PhonesHero`: device frames sized in container-query units, so they scale down to 360px. They sit outside the 680px text column (max 1040px). |
| `Shots.tsx` | `Screenshot` and `PhoneShots`, taking images from `content/media.ts`. |
| `MapPreview.tsx` | The KU Campus Map hero, see below. |
| `Ph.tsx` | The dashed placeholder chip, for text in `[brackets]`. |

`components/MediaSlot.tsx` renders an image or looping video that fills its parent, or a striped placeholder box when no media is supplied. `LoopVideo.tsx` plays only while on screen and never with reduced motion.

### Diagrams: `components/diagrams/`

Diagrams are HTML and CSS, not images, so their text is real, selectable and readable by screen readers.

- `primitives.tsx`: `DiagramFrame`, `Node`, `Stack`, `Arrow` and `Flow`. `Flow` is a horizontal grid that becomes a vertical stack below 560px, and `Arrow` switches from → to ↓ at the same breakpoint.
- `index.tsx`: the Smart Dorm, KU Campus Map, Kasetfair POS, Clean Architecture and CI pipeline diagrams. The ttb page uses the last two, which are generic and self-drawn.
- `SmartDormWorkflow.tsx`: the before/after billing diagram, in a hero version and a small preview version for the homepage.

### Command menu: `components/command/`

`CommandMenuHost` is mounted once in the root layout. It listens for ⌘K / Ctrl+K and for a custom event (`OPEN_PALETTE_EVENT` in `lib/palette.ts`) that `PaletteButton` dispatches. `CommandMenu` itself (cmdk inside a Radix Dialog) is loaded with `next/dynamic` and `ssr: false`, so those libraries only download the first time it opens. A counter used as the component `key` resets the query on every open. Commands: go to each case study, copy email, download resume, GitHub, LinkedIn, toggle theme. Case study links come from `caseLinks`, so a new project appears automatically.

### Selected-work rows: `components/home/ProjectRow.tsx`

Two behaviours for the same preview:

- **Hover or focus preview.** Only when the screen is at least 1360px wide and the device has a mouse (`(hover: hover) and (pointer: fine)`). Pure CSS in `globals.css`: `.project-row:hover .project-row-gutter` (and `:focus-within`) shows a floating card in the right margin. That card is `aria-hidden`, because it only repeats content.
- **Tap to expand.** Everywhere else, a "Preview ▾" button with `aria-expanded` and `aria-controls` expands the same preview inline. The preview is only mounted while expanded.

The helper text above the list ("Hover a row to preview" / "Tap preview to expand") switches at the same breakpoint.

### Page-load reveal: `components/reveal.ts`

`reveal(i, kind)` returns `data-reveal` and a `--i` CSS variable. CSS in `globals.css` animates each element for 560ms, delayed by `80ms + i × 70ms`. `kind` is `"fade"` or `"rise"`. Large hero text uses `"rise"`, which moves without fading so the text counts as painted on the first frame (see [Performance](#7-performance)).

### KU Campus Map preview: `MapPreview.tsx`

The map is a separate project (React, Vite, three.js) deployed at ku-map-beta.vercel.app. This site does not bundle it: three.js would be a large bundle for a page that is mostly text. `MapPreview` shows a poster image and a "Load interactive map" button. Only after the click does it render an `<iframe>` pointing at the live map. It also has "Unload map" and "Skip ↓" (to the first section), and when the visitor prefers reduced motion it says so and still loads nothing until asked.

### Other client components

`ThemeToggle`, `CopyEmailButton` (with a live-region toast), `TrackedLink` and `TrackView` (analytics, see `lib/analytics.ts`).

---

## 4. Design system

The full token table, type scale and spacing live in [CLAUDE.md](../CLAUDE.md#design-tokens-appglobalscss); this is the summary.

- **Tokens.** CSS variables on `:root` in `app/globals.css` (`--paper`, `--surface`, `--raise`, `--ink`, `--muted`, `--line`, `--dot`, `--accent`, …), exposed to Tailwind as `bg-paper`, `text-ink`, `border-line`, `text-accent` through `@theme inline`. Light is the default; dark is a warm charcoal.
- **Fonts through `next/font`.** `lib/fonts.ts`: IBM Plex Sans (400/500/600) and IBM Plex Mono (400/500), with the sans italic loaded on demand (`preload: false`) because it's used for one short line. `lib/fonts-serif.ts`: Instrument Serif for case study titles, applied in `app/work/layout.tsx` so it is only preloaded on `/work/*`. `lib/fonts-serif-lazy.ts`: the same face with preload off, for the 404 page.
- **No-flash theme.** A small inline script in `<head>` (`themeScript` in `lib/theme.ts`) runs before first paint. It reads `localStorage.theme`, falls back to the OS setting, and sets `data-theme` on `<html>`. `<html>` has `suppressHydrationWarning` for that reason. `ThemeToggle` reads the attribute with `useSyncExternalStore`, writes the choice back to `localStorage` (inside `try/catch`, since storage can be blocked), and keeps following the OS until a choice has been stored. The glyph switches in CSS, so the first paint is already right.
- **Dark mode in CSS.** Dark tokens apply under `prefers-color-scheme: dark` unless `data-theme="light"` is set, and always under `data-theme="dark"`. Tailwind's `dark:` variant is bound to `data-theme`.
- **One staggered reveal** on page load (see [Components](#page-load-reveal-componentsrevealts)).
- **Reduced motion.** A `prefers-reduced-motion: reduce` block disables all animations and transitions; `LoopVideo` and `MapPreview` check the preference too.

---

## 5. Images and media

`scripts/optimize-images.mjs` is the only way images get into the site.

1. **Originals** live in `sources/assets/<slug>/`. That folder is gitignored and never committed: it holds unprocessed screenshots, including ones with other people's photos, and other private material.
2. **The `IMAGES` table** in the script maps a key to a source file, a slug, an output name and a maximum width (and optionally a crop).
3. **For the Kasetfair POS screenshots** the script first blurs the product photos and the image-URL field (`POS_BLUR`, regions in original pixels, `sharp` blur of 28), because those photos come from other websites. It then crops off the iOS status bar and the Safari address bar (`POS_CROP`).
4. **Output.** Each image is resized (never enlarged) and written as WebP (quality 86) to `public/work/<slug>/<name>.webp`.
5. **`content/media.ts`** is regenerated with each image's URL, width, height and a 16px WebP `blurDataURL`. MDX imports `media` and passes entries to `<Screenshot>` and friends, so every image has its real dimensions (no layout shift) and a blur placeholder.
6. **Serving.** `next/image` serves AVIF or WebP at the width each layout needs (`images.formats` in `next.config.ts`).
7. **Loading.** `MediaSlot` renders every image lazily, hero images included. Preloading a hero image made Largest Contentful Paint slower on phones (see [Performance](#7-performance)).

To add an image: put the original in `sources/assets/<slug>/`, add a line to `IMAGES`, run `node scripts/optimize-images.mjs`, then use `media.<key>` in MDX.

---

## 6. SEO and share previews

| Piece | Where | What it does |
|---|---|---|
| Base metadata | `app/layout.tsx` | `metadataBase` (from `SITE_URL`), title template, description, `twitter: summary_large_image`, site name, locale. |
| Page metadata | `app/page.tsx`, `app/work/[slug]/page.tsx` | Canonical URL (`alternates.canonical`), Open Graph title, description and URL. Relative URLs are resolved against `metadataBase`. |
| Share images | `app/opengraph-image.tsx`, `app/work/[slug]/opengraph-image.tsx` | 1200×630 PNG per page, rendered at build time by `renderOgImage` in `lib/og.tsx` (`next/og`) using the vendored fonts in `lib/og-fonts/`. Next adds `og:image`, `og:image:width/height/type` and `twitter:image` automatically, with a content hash in the query string. |
| Sitemap | `app/sitemap.ts` | Home plus one entry per case study, with `SITE_URL` as the origin. |
| Robots | `app/robots.ts` | Allow all, and points to the sitemap. |
| JSON-LD | `app/page.tsx` | A `Person` object (name, job title, alma mater, links). |
| Icons | `app/icon.svg`, `app/apple-icon.tsx` | Favicon and Apple touch icon. |

### `SITE_URL` and canonical URLs

`lib/site.ts` builds the site's origin from, in order: `SITE_URL`; `https://$VERCEL_PROJECT_PRODUCTION_URL`; `http://localhost:3000`. Every absolute URL in the metadata derives from it. A local build therefore contains `http://localhost:3000/...` in its HTML, which is expected.

### The share-image bug

**Symptom.** Sharing the link in chat apps showed no preview image.

**What was wrong, two separate things:**

1. **The image URL pointed at a host that didn't exist.** `SITE_URL` was unset, so the build used `VERCEL_PROJECT_PRODUCTION_URL`. That resolved to a hostname that no longer pointed at any deployment (probably left over from before the Vercel project was renamed), and the built HTML said `og:image = https://<that host>/opengraph-image?…`. Requesting it returned `404 DEPLOYMENT_NOT_FOUND`.
2. **Deployment Protection was on.** Vercel answered scrapers with a login redirect instead of the page, so they couldn't read the meta tags or fetch the image even from the right host.

**The fix.** Set `SITE_URL` explicitly for Production, redeploy so the build picks it up, and turn Deployment Protection off for the public site. The share image routes themselves needed no changes.

**Lesson.** Don't rely on the Vercel-provided hostname for anything that is shared outside Vercel. Set `SITE_URL`, and after any domain change check the built HTML (see [the walkthrough](#walkthrough-fix-a-broken-share-preview)).

---

## 7. Performance

**Budget:** Lighthouse mobile performance 95 or more, Largest Contentful Paint (LCP) 2.5 s or less, Cumulative Layout Shift (CLS) 0.1 or less.

**Current numbers.** Lighthouse 13, mobile preset with simulated throttling, against `next start` on localhost, median of three runs:

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 96 | 100 | 96 | 100 | 2.7 s | 0 | 43 ms |
| `/work/kasetfair-pos` | 95 | 100 | 96 | 100 | 3.0 s | 0 | 45 ms |
| `/work/ku-campus-map` | 95 | 100 | 96 | 100 | 2.9 s | 0 | 20 ms |

Best practices 96 comes from a local-only 404 for `/_vercel/insights/script.js`, which exists once deployed. Scores meet the 95 target, CLS is 0, and LCP is a few tenths over its target.

**What the LCP work found:**

- **The LCP element is the hero text on every page**, not an image. So the fix is to make the text paint on the first frame: large hero text uses `reveal(i, "rise")` (movement only, no opacity fade), because a fade delays the paint that counts.
- **Fonts.** The serif is only preloaded on `/work/*`, the sans italic and the 404 serif are not preloaded, and `next/font` generates metric-matched fallbacks so there is no shift when a font arrives.
- **Hero images are lazy, not `preload`/`priority`.** On phones the case study title is the LCP and the hero sits below it, so preloading the hero image only competed with the text: 3.1 s versus 2.8 s in the test that decided it.
- **A floor of about 2.5–2.6 s.** A bare Next.js page with this layout measured that on the same machine and settings. The remaining gap is mostly framework JavaScript and fonts under simulated slow 4G.
- **Code that stays out of the first load.** The command menu (cmdk + dialog) is lazy, and three.js is never in this site's bundles.

**How to re-measure:**

```bash
npm run build && npm start        # then, in another terminal:
npx lighthouse http://localhost:3000/ --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json
```

Run it three times per page and take the median; run-to-run variance is large. For real-network numbers, run PageSpeed Insights against the public URL.

---

## 8. Accessibility

- **Keyboard and focus.** Every control is a real link or button. `:focus-visible` shows a 2px accent outline everywhere. The command menu (Radix Dialog) traps focus and closes with Esc. Project row previews open on keyboard focus (`:focus-within`) as well as hover.
- **Touch targets.** Buttons and links are at least 44px tall (`min-h-11`, `.btn`, `.link-mono`), with padding added to inline links where needed.
- **Semantics.** Sections are `<section aria-labelledby>`, navigation is in `<nav aria-label>`, and decorative arrows and the dot grid are `aria-hidden`. The preview toggle uses `aria-expanded` and `aria-controls`.
- **Announcements.** Copy-email and the command menu toast are announced through a polite live region (`role="status"`).
- **Alt text.** Every screenshot has descriptive alt text in the MDX; diagrams are real text.
- **Colour.** Tokens are defined for both themes, and Lighthouse's accessibility audit, including contrast, scores 100 on the pages above.
- **Reduced motion.** See [Design system](#4-design-system): animations are removed, videos don't play, and the map stays unloaded until asked.
- **Small screens.** Layouts hold down to 360px without horizontal scrolling; diagrams stack below 560px.

---

## 9. Content rules

Full list in [CLAUDE.md](../CLAUDE.md#content-rules). In short:

- No photo of the owner, no GPA, no phone number.
- Never invent metrics, quotes or screenshots.
- The ttb case study is text and generic self-drawn diagrams only. It carries the note "Product details and visuals omitted under confidentiality."
- Kasetfair POS has strict accuracy rules about what the app does (no real-time claims, no stock quantities, who can read data, test data only). Check CLAUDE.md before editing that page.
- The KU Campus Map role is always written in full.
- `sources/` (private notes and source documents) is never committed.

---

## 10. Walkthroughs

### Walkthrough: add a new case study

Example slug: `my-project`.

1. **Write the file.** Create `content/work/my-project.mdx`. Start with `export const meta = { … }` following `CaseMeta` (`slug`, `order`, `title`, `shortTitle`, `year`, `readTime`, `summary`, `description`, `role`, `timeline`, `stack`, `links`). Give it the next `order`. Then add the numbered `<Section n="01" title="TL;DR" id="tldr">` blocks; hide a section rather than leave it empty.
2. **Register it.** In `lib/work.ts`, import the file (`import MyProject, { meta as myProject } from "@/content/work/my-project.mdx"`) and add `{ meta: myProject, Content: MyProject }` to `ALL`. This single step gives you the static route, the command menu entry, the sitemap entry, the 404 page list, the next-project link and the share image.
3. **Feature it on the homepage.** Add a row to `selectedWork` in `content/home.ts` (or to `moreProjects` for a small one).
4. **Diagram (optional).** Add a component to `components/diagrams/index.tsx` using the primitives, and register it in `mdx-components.tsx`.
5. **Images (optional).** Put originals in `sources/assets/my-project/`, add them to `IMAGES` in `scripts/optimize-images.mjs`, and run it. Use `import { media } from "@/content/media";` at the top of the MDX file.
6. **Check.** Run `npm run lint`, `npx tsc --noEmit` and `npm run build`. The build must list `/work/my-project` and its `opengraph-image` as static. Open `/work/my-project` and `/work/my-project/opengraph-image` locally.
7. **Commit and deploy.**

### Walkthrough: fix a broken share preview

1. **Read what the page says.** `curl -s https://<site>/ | grep -oE '<meta[^>]*og:[^>]*>'`. The `og:image` and `og:url` hosts must be the public address you are sharing. A wrong host means `SITE_URL` is missing or stale.
2. **Fetch the image.** `curl -I "<the og:image URL>"` should return `200` with `content-type: image/png`.
3. **Fetch as a scraper.** `curl -I -A "facebookexternalhit/1.1" https://<site>/`. A `302`, `401` or a Vercel login page means Deployment Protection is blocking scrapers. On a protected deployment, `vercel curl / --deployment <url>` lets you inspect the HTML as the logged-in owner.
4. **Fix the cause.** Set `SITE_URL` (`vercel env add SITE_URL production`) and redeploy with `vercel deploy --prod`, and/or turn off Deployment Protection for the public site. Then repeat steps 1–3.
5. **Refresh the scrapers' caches.** They remember the old result: use Facebook's Sharing Debugger ("Scrape again") and LinkedIn's Post Inspector. LINE and others may need a little time or a new URL. The share image URL carries a content hash, so changing the image changes the URL.

---

## 11. Decision log

| Choice | Why |
|---|---|
| Next.js with fully static output | Content never changes at request time, so static HTML gives the best speed and nothing to run or secure. The build fails if a page stops being static. |
| MDX for case studies | Prose stays prose, with a small set of shared components, so a new case study is one file and consistent by construction. |
| Tailwind CSS 4 with CSS-variable tokens | One set of tokens drives light and dark; the design's spacing and type are easy to express as utilities. |
| cmdk, loaded lazily | A good command menu for free (filtering, keyboard, a11y), downloaded only if someone opens it. |
| The 3D map in an iframe, after a click | Keeps three.js out of this site's bundle, so the page stays fast and nothing heavy loads unless the visitor asks. |
| Hero images are lazy, not `priority` | Preloading them slowed LCP on phones, where the text is the LCP element. |
| Hero text rises instead of fading | An opacity fade delays the first paint of the LCP element; movement alone doesn't. |
| Instrument Serif only on `/work/*` | The serif is for case study titles, so the homepage doesn't pay for preloading it. |
| Vendored OG fonts and `"use cache"` | Keeps the share-image routes static and makes sure the build includes the font files. |
| Per-page share images generated from data | They can't drift from the case study titles and summaries, and a new project gets one automatically. |
| Blurred food photos in the POS screenshots | They come from other websites, so they must not be shown clearly. The blur is applied by the script, not by hand. |
| Generic names in the ttb case study | It's confidential bank work: text and self-drawn diagrams only. |
| HTML/CSS diagrams, not images | Real text, theme-aware colours, crisp at any size, and they stack on phones. |
| `SITE_URL` set explicitly | The hosting platform's own hostname isn't reliable enough to put in share links (see [the bug](#the-share-image-bug)). |

---

## 12. Glossary

- **App Router.** Next.js's `app/` directory routing.
- **Cache Components.** A Next.js mode (`cacheComponents: true`) in which uncached request-time work must be wrapped in `<Suspense>` or cached explicitly. `"use cache"` marks cacheable work and `cacheLife` sets how long.
- **Case study.** One project page, `content/work/<slug>.mdx`.
- **CLS / LCP / TBT.** Cumulative Layout Shift, Largest Contentful Paint, Total Blocking Time: Lighthouse performance metrics.
- **`ensureStatic`.** A route setting that makes the build report an error when a route can't be prerendered.
- **`meta`.** The front matter object exported by each MDX file, typed as `CaseMeta`.
- **`media`.** The generated object in `content/media.ts` mapping a key to an image's URL, size and blur placeholder.
- **Open Graph (OG) image.** The 1200×630 picture shown when a link is shared.
- **Palette / command menu.** The ⌘K dialog.
- **Placeholder chip (`Ph`).** A dashed `[LIKE THIS]` marker for content not yet supplied.
- **`POS_BLUR` / `POS_CROP`.** Regions the image script blurs or crops in the Kasetfair POS screenshots.
- **Reveal.** The staggered page-load animation driven by `data-reveal`.
- **Rise.** The reveal variant that moves without fading.
- **`SITE_URL`.** The environment variable holding the site's public origin.
- **Deployment Protection.** A Vercel setting that puts a login in front of deployments.

---

## 13. Five files to read first

1. **[`lib/work.ts`](../lib/work.ts)**: the registry. It shows how case studies become routes, the command menu, the sitemap and the next-project loop in about 40 lines.
2. **[`app/work/[slug]/page.tsx`](../app/work/%5Bslug%5D/page.tsx)**: how one case study page is assembled: static params, metadata, header, MDX body, footer.
3. **[`mdx-components.tsx`](../mdx-components.tsx)**: the vocabulary available inside every MDX file.
4. **[`app/globals.css`](../app/globals.css)**: the design tokens, dark mode, shared classes and the reveal and hover-preview CSS.
5. **[`lib/og.tsx`](../lib/og.tsx)** together with **[`lib/site.ts`](../lib/site.ts)**: the share image and the `SITE_URL` logic that caused the preview bug.
