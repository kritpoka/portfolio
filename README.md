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

The resume is in place (`public/resume.pdf`, the web version: no phone number, GPA or stock claim).

### Homepage (`content/home.ts`)

Nothing outstanding. Smart Dorm shows a before/after workflow diagram, KU Campus Map the share image, Kasetfair POS the dashboard screenshot. The ttb row has no preview on purpose.

### Smart Dorm (`content/work/smart-dorm.mdx`)

**Nice to have**
- [ ] **Screenshots.** The hero and homepage preview are a before/after workflow diagram for now. If you add screens (or share Figma links and I pull them with the Figma MCP `get_screenshot`), swap in `BrowserPhoneHero` or `<Screenshot>`.
- [ ] 07 Outcome: a result (staff feedback, time saved, whether it was adopted). Hidden for now; the spot is marked in the MDX.

"What I'd change" stays hidden, and there is a single key finding and two decisions, as confirmed.

### KU Campus Map (`content/work/ku-campus-map.mdx`)

Nothing outstanding.

### Kasetfair POS (`content/work/kasetfair-pos.mdx`)

Nothing outstanding. Product photos in the screenshots come from other websites, so they are blurred by `scripts/optimize-images.mjs`; keep that if you re-export the screens.

### ttb internship (`content/work/ttb.mdx`)

Text and generic diagrams only: no screenshots, ever.

**Blocks launch**
- [ ] **Your ttb supervisor's OK on the page text** before publishing.

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
