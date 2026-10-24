# krit.poka — portfolio

Personal site for Krit Poka: software engineer who designs — Flutter, Next.js, and the UX in between.

Built from the Claude Design handoff ("Engineer's Notebook"): a short homepage plus one case study per featured project.

- **Stack:** Next.js 16 (App Router, Cache Components, every route prerendered), TypeScript, Tailwind CSS 4, MDX, cmdk, Vercel Analytics.
- **Pages:** `/`, `/work/smart-dorm`, `/work/ku-campus-map`, `/work/kasetfair-pos`, `/work/ttb`, plus a 404 page.
- **Content:** case studies live in `content/work/*.mdx`; homepage copy is in `content/home.ts`. See `CLAUDE.md` for the template and how to add a project.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; fails if any page stops being static
npm run lint
```

## Configuration

| Variable | Purpose |
|---|---|
| `SITE_URL` | Canonical origin, e.g. `https://example.com`. Leave unset until a custom domain is connected: on Vercel the production URL is used instead. Used for metadata, `sitemap.xml` and `robots.txt`. |

The footer's "Last updated" date is the build date.

## Content to add

What's still missing or unconfirmed. Placeholders show on the site as a dashed `[PLACEHOLDER]` chip or a striped "[SCREENSHOT]" box. Sections with nothing to show yet are hidden, not left empty.

**Blocks launch:** a featured project is missing its visuals, or something must be confirmed before going public. **Nice to have:** the page reads fine without it.

### Site-wide

**Nice to have**
- [ ] **Custom domain.** Connect it in Vercel and set `SITE_URL`.

The resume is in place: `public/resume.pdf`, copied from `sources/assets/resume.pdf`.

### Homepage (`content/home.ts`)

**Blocks launch**
- [ ] `[SCREENSHOT] Smart Dorm dashboard`: the Smart Dorm row preview (4:3).

KU Campus Map uses the share image and Kasetfair POS uses the ordering screen. The ttb row has no preview on purpose.

### Smart Dorm (`content/work/smart-dorm.mdx`)

**Blocks launch**
- [ ] **Hero images:**
  - `[SCREENSHOT / VIDEO] Staff dashboard — billing` (browser frame, about 16:10)
  - `[SCREENSHOT] Resident app` (phone, 9:19)

  If you share Figma file links, Smart Dorm screens can be pulled with the Figma MCP (`get_screenshot`).

**Nice to have**
- [ ] 07 Outcome: `[ADD ANY RESULT — e.g. staff feedback, time saved, whether it was adopted]`.
- [ ] 04 Users & research: a second finding from the staff test, and what changed in the design because of it. The notes mark this optional, so no chip is shown.
- [ ] 05 Decisions & trade-offs: more decisions, if you can confirm details. There are two for now.
- [ ] **What I'd change:** hidden until you have something to add.

### KU Campus Map (`content/work/ku-campus-map.mdx`)

**Nice to have**
- [ ] Merge anything new from your build-conversation summary `.md` once you add it. It isn't in `sources/notes/` yet.
- [ ] 09 What I'd change: confirm or trim "I'd also verify the approximate shuttle stops on campus."

### Kasetfair POS (`content/work/kasetfair-pos.mdx`)

**Blocks launch**
- [ ] **Rights check on food photos.** The product photos inside the screenshots appear to come from other websites; the edit screen shows a URL from sgethai.com. Confirm you can show them, or I'll blur them or swap in other screens.

**Nice to have**
- [ ] **What I'd change:** hidden until you confirm it. Candidates from your notes:
  - per-role policies (cashier vs owner)
  - Realtime so several phones stay in sync
  - offline mode for weak fair Wi-Fi

### ttb internship (`content/work/ttb.mdx`)

Text and generic diagrams only: no screenshots, ever.

**Blocks launch**
- [ ] **Your ttb supervisor's OK on the page text** before publishing (from your notes).
- [ ] 08 What I'd change uses the three points drafted from the co-op report. Keep, edit or drop them.

### Adding media

Put originals in `sources/assets/<slug>/` (gitignored), add them to `scripts/optimize-images.mjs`, then run:

```bash
node scripts/optimize-images.mjs
```

This writes resized WebP files to `public/work/<slug>/` and regenerates `content/media.ts` with each image's width, height and blur placeholder. Use the images in MDX:

```mdx
import { media } from "@/content/media";

<Screenshot image={media.kuMapShuttle} alt="…" caption="…" />
<PhoneShots shots={[{ image: media.posDashboard, alt: "…", caption: "…" }]} />
<BrowserPhoneHero web={{ type: "image", src: media.someKey, alt: "…" }} caption="…" />
```

`next/image` serves AVIF/WebP at the width each layout needs. Images are lazy-loaded, the hero included: on phones the title is the LCP and preloading the hero image slowed it down. For video, use `{ type: "video", mp4, webm, poster, alt }`: muted, looping, plays only on screen, never with reduced motion, and kept under 3 MB.

Don't use the KU Map landmark photos (other photographers' work), and never add anything from ttb.

## Performance

Lighthouse 13, mobile, simulated throttling, against `next start` on localhost. Median of three runs:

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 96 | 100 | 96 | 100 | 2.7 s | 0 | 43 ms |
| `/work/kasetfair-pos` | 95 | 100 | 96 | 100 | 3.0 s | 0 | 45 ms |
| `/work/ku-campus-map` | 95 | 100 | 96 | 100 | 2.9 s | 0 | 20 ms |

- **Best practices 96:** this is only the local 404 for `/_vercel/insights/script.js`, which exists once deployed.
- **LCP:** the LCP element is the hero text on every page. A bare Next.js page with this layout measures 2.5–2.6 s on the same setup, so the remaining gap is mostly framework JS and fonts under simulated slow 4G. Re-check with PageSpeed Insights on the Vercel URL.
