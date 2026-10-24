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

Everything below shows on the site as a dashed `[PLACEHOLDER]` chip or a striped "[SCREENSHOT]" box. Nothing has been invented; replace each one with a real fact or delete it.

**Blocks launch** = visible near the top of a page, or a broken link. **Nice to have** = the page reads fine without it.

### Site-wide

**Blocks launch**
- [ ] **Resume PDF.** Add `public/resume.pdf`. The hero button, footer link and command menu all point to `/resume.pdf` and return 404 until it exists. Don't reuse `sources/Krit_Resume.pdf` as is: it shows your GPA and phone number and says "third-year".

**Nice to have**
- [ ] **Custom domain.** Connect it in Vercel and set `SITE_URL`.

### Homepage (`content/home.ts`)

**Blocks launch**
- [ ] `[SCREENSHOT] Smart Dorm dashboard`: row preview (4:3).
- [ ] `[SCREENSHOT] 3D campus view`: KU Campus Map row preview (4:3).
- [ ] `[SCREENSHOT] POS checkout + QR`: Kasetfair POS row preview (4:3).

The ttb row has no preview on purpose.

### Smart Dorm (`content/work/smart-dorm.mdx`)

**Blocks launch**
- [ ] Hero `[SCREENSHOT / VIDEO] Staff dashboard — billing` (browser frame, about 16:10) and `[SCREENSHOT] Resident app` (phone, 9:19).
- [ ] Header: Team `[TEAM SIZE + ROLES]`, Timeline `[START – END]`.
- [ ] Header links: Live `[LINK]`, GitHub `[LINK]`, Figma `[LINK]`. Add a URL or remove the chip. `kritpoka/ku-dorm-frontend` is public, but its README is still the Flutter template.
- [ ] 02 Context & problem: `[PROBLEM DETAIL — how billing and requests worked before]`.

**Nice to have**
- [ ] 04 Users & research: `[N]` participants, `[PROTOTYPE / EXISTING PROCESS]`, findings F1–F3 (`[FINDING — what users struggled with]`, `[FINDING]` ×2). The page says you ran usability studies, so this section is the strongest proof of it.
- [ ] 06 Architecture: Database `[VERIFY]`. Which database did the Spring Boot API use?
- [ ] 07 Build highlights: Billing module `[DETAIL — invoices, payment status, history]`.
- [ ] 08 Outcome: `[METRIC]` task success before → after, `[METRIC]` residents / staff using it, `[QUOTE]` from a resident or staff member.

### KU Campus Map (`content/work/ku-campus-map.mdx`)

**Blocks launch**
- [ ] Hero `[POSTER] Static render of the 3D campus` (16:9). It's shown before the 3D map loads. The map repo's `scripts/og-image.mjs` already renders one.
- [ ] Header: Timeline `[START – END]`.
- [ ] Header links: GitHub `[LINK]` (`ku-bangkhen-campus-map` is private: make it public or remove the chip), Figma `[LINK]`.
- [ ] 02 Context & problem: `[PROBLEM DETAIL — what existing maps lacked]`.

**Nice to have**
- [ ] 04 Users & research: `[USER GROUPS — e.g. first-years, visitors, exchange students]`, `[METHOD + N]`, findings F1–F3.
- [ ] 07 Build highlights: `[METRIC — fps / load time on a mid-range phone]`. The repo's `docs/performance.md` only has emulated figures, so a real-phone measurement is needed.
- [ ] 08 Outcome: `[METRIC]` visitors / sessions, `[METRIC]` time to find a building, `[QUOTE]` from a student or visitor.

### Kasetfair POS (`content/work/kasetfair-pos.mdx`)

**Blocks launch**
- [ ] Hero `[SCREENSHOT / VIDEO] POS checkout on a tablet` (4:3) and `[SCREENSHOT] PromptPay QR` (phone, 9:19). `ku-media-pos/images/` has five phone screenshots you could use.
- [ ] Header: Timeline `[START – END]`. Repo commits run from 24 Dec 2025 to 5 Jan 2026.
- [ ] Header link: Figma `[LINK]`. Add it or remove the chip.
- [ ] 02 Context & problem: `[PROBLEM DETAIL — how vendors tracked stock and sales before]`.
- [ ] **Accuracy check: realtime and row-level security.** The design says stock updates live and every table is protected by RLS. The repo has no Supabase Realtime subscription and no RLS policy files. Policies may exist only in the Supabase dashboard. Please confirm, then fill `[VERIFY mechanism]` (07) and the dashed "Realtime — [VERIFY]" box (06), or edit the claims.

**Nice to have**
- [ ] 04 Users & research: `[METHOD + N]`, findings F1–F3.
- [ ] 08 Outcome: `[METRIC]` vendors using it, `[METRIC]` transactions processed, `[QUOTE]` from a vendor.

### ttb internship (`content/work/ttb.mdx`)

Text and generic diagrams only: no screenshots, ever.

**Blocks launch**
- [ ] 09 What I'd change: `[REFLECTION]` ×2. The co-op report covers problems and lessons, not what you'd do differently. Write two lines, or remove the section.

**Nice to have**
- [ ] Nothing else. Outcome uses the poster's figures: 3 tools, 1 central data source, 4 lanes, 2 live features.

### Adding media

Put files in `public/` or import them in the MDX, then pass them to the slot:

```mdx
import dashboard from "@/assets/smart-dorm/dashboard.png";

<BrowserPhoneHero web={{ type: "image", src: dashboard, alt: "Staff billing dashboard" }} caption="…" />
```

Images go through `next/image` (AVIF/WebP). For video, use `{ type: "video", mp4, webm, poster, alt }`: muted, looping, plays only on screen, never with reduced motion. Keep each video under 3 MB.

## Facts filled from your materials

These came from your repos and the co-op report rather than the design. Please check them:
- **Years and roles:** as you confirmed in chat.
- **Smart Dorm, My role:** Flutter login, room, payment and profile screens, with the user feature through BLoC (from `ku-dorm-frontend` commits).
- **KU Campus Map:**
  - Pins are HTML buttons over the 3D scene (from `docs/ARCHITECTURE.md`).
  - Render-on-demand, and the scene loads as its own chunk (from `docs/performance.md`).
  - The OSM → Overpass → TopoJSON step in the diagram caption (from the README).
- **Kasetfair POS:**
  - "My role" lists ordering, stock, payment, dashboard and sign-in (from the repo structure).
  - Payment is confirmed by hand: staff tap Confirm after checking the transfer (from `app/payment/page.tsx`).
- **ttb:**
  - Scope per workstream and how requirements arrived (report §5.1, §3.4.3).
  - Outcome figures (from the co-op poster, as listed in `SOURCES.md`).

## Performance

Measured with Lighthouse 13 (mobile, simulated throttling) against `next start` on localhost:

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 96 | 100 | 96 | 100 | 2.7 s | 0 | 60 ms |
| `/work/*` (all four) | 97 | 100 | 96 | 100 | 2.5 s | 0 | 20–40 ms |

- **Best practices 96:** this is only the local 404 for `/_vercel/insights/script.js`, which exists once deployed on Vercel.
- **LCP floor:** a bare Next.js page with this layout measures 2.5–2.6 s on the same setup. Re-check `/` with PageSpeed Insights on the Vercel URL, where Brotli and the CDN usually help.
