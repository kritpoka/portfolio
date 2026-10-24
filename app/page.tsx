import type { Metadata } from "next";
import CopyEmailButton from "@/components/CopyEmailButton";
import MediaSlot from "@/components/MediaSlot";
import ThemeToggle from "@/components/ThemeToggle";
import TrackedLink from "@/components/TrackedLink";
import PaletteButton from "@/components/command/PaletteButton";
import ProjectRow from "@/components/home/ProjectRow";
import { reveal } from "@/components/reveal";
import { experience, howIWork, moreProjects, recognition, selectedWork } from "@/content/home";
import { BUILD_DATE, DEFAULT_DESCRIPTION, EMAIL, LINKS, NAME, RESUME_PATH, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: `${NAME} — Software engineer who designs`,
    description: DEFAULT_DESCRIPTION,
    url: "/",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME,
  url: SITE_URL,
  email: `mailto:${EMAIL}`,
  jobTitle: "Software engineer",
  description: "Software engineer who designs — Flutter, Next.js, and the UX in between.",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Kasetsart University", url: LINKS.ku },
  address: { "@type": "PostalAddress", addressLocality: "Bangkok", addressCountry: "TH" },
  knowsAbout: ["Flutter", "Next.js", "UX design", "Clean Architecture"],
  sameAs: [LINKS.github, LINKS.linkedin],
};

const sectionTitle = "label m-0 border-b border-line pb-3";
const external = <span aria-hidden="true" className="text-muted">↗</span>;

export default function Home() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <div aria-hidden="true" className="dot-grid h-[760px]" />

      <header className="relative mx-auto flex max-w-[680px] items-center justify-between gap-4 px-6 pt-6">
        <a
          href="#top"
          className="inline-flex min-h-11 items-center gap-2.5 font-mono text-[13px] leading-none font-medium text-ink no-underline"
        >
          <span className="grid size-6 place-items-center rounded-md border border-ink text-[10px] tracking-[0.02em]">KP</span>
          <span>krit.poka</span>
        </a>
        <div className="flex gap-2">
          <PaletteButton />
          <ThemeToggle />
        </div>
      </header>

      <main id="top" className="relative mx-auto max-w-[680px] px-6">
        <section aria-labelledby="hero-name" className="pt-[88px] pb-2">
          <p {...reveal(0)} className="mt-0 mb-[22px] flex items-center gap-2.5 font-mono text-[13px] leading-normal text-muted">
            <span
              aria-hidden="true"
              className="size-2 flex-none rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent)_18%,transparent)]"
            />
            <span>Open to software engineering, mobile and design-engineer roles</span>
          </p>
          <h1 {...reveal(1, "rise")} id="hero-name" className="m-0 text-5xl leading-[1.05] font-medium tracking-[-0.025em]">
            Krit Poka
          </h1>
          <p {...reveal(2, "rise")} className="mt-4 mb-0 max-w-[26ch] text-[26px] leading-[1.3] tracking-[-0.01em] text-balance">
            Software engineer who designs — Flutter, Next.js, and the UX in between.
          </p>
          <p {...reveal(3)} className="mt-5 mb-0 font-mono text-[13px] leading-[1.7] text-muted">
            Final-year Computer Science, <a href={LINKS.ku}>Kasetsart University</a> · Bangkok
          </p>
          <nav {...reveal(4)} aria-label="Contact and profiles" className="mt-8 flex flex-wrap items-center gap-2">
            <TrackedLink
              href={RESUME_PATH}
              download="Krit-Poka-Resume.pdf"
              event={{ name: "Resume click", location: "hero" }}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-4 text-[15px] font-medium text-paper no-underline"
            >
              Resume <span className="font-mono text-[11px] leading-none font-normal opacity-75">PDF</span>
            </TrackedLink>
            <a href={LINKS.github} className="btn text-[15px]">
              GitHub {external}
            </a>
            <a href={LINKS.linkedin} className="btn text-[15px]">
              LinkedIn {external}
            </a>
            <span className="inline-flex items-stretch rounded-lg border border-line bg-raise">
              <TrackedLink
                href={LINKS.email}
                event={{ name: "Email click", location: "hero" }}
                className="inline-flex min-h-11 items-center pr-3 pl-3.5 text-[15px] text-ink no-underline"
              >
                {EMAIL}
              </TrackedLink>
              <span className="inline-flex border-l border-line">
                <CopyEmailButton
                  location="hero"
                  toast="below-end"
                  className="min-h-11 min-w-14 cursor-pointer rounded-r-[7px] border-0 bg-transparent px-3 font-mono text-xs leading-none font-medium text-muted hover:bg-surface hover:text-ink"
                />
              </span>
            </span>
          </nav>
        </section>

        <section aria-labelledby="work" className="pt-[88px]">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <h2 id="work" className="label m-0">
              Selected work
            </h2>
            <span className="font-mono text-xs leading-none text-muted">
              <span className="hidden min-[1360px]:[@media(hover:hover)]:inline">Hover a row to preview</span>
              <span className="min-[1360px]:[@media(hover:hover)]:hidden">Tap preview to expand</span>
            </span>
          </div>
          <ol className="m-0 list-none p-0">
            {selectedWork.map(({ preview, ...row }) => (
              <ProjectRow
                key={row.title}
                {...row}
                preview={
                  preview && (
                    <MediaSlot media={preview.media} placeholder={preview.placeholder} sizes="(min-width: 1360px) 300px, 100vw" />
                  )
                }
              />
            ))}
          </ol>
        </section>

        <section aria-labelledby="exp" className="pt-20">
          <h2 id="exp" className={sectionTitle}>
            Experience
          </h2>
          <ol className="m-0 list-none p-0">
            {experience.map((e) => (
              <li key={e.title} className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line py-5">
                <span className="flex-[0_0_112px] pt-[3px] font-mono text-[13px] leading-normal text-muted">{e.when}</span>
                <div className="min-w-0 flex-[1_1_300px]">
                  <h3 className="m-0 text-base leading-[1.45] font-medium">{e.title}</h3>
                  <p className="mt-1 mb-0 text-[15px] text-muted">{e.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="more" className="pt-20">
          <h2 id="more" className={sectionTitle}>
            More projects
          </h2>
          <ul className="m-0 list-none p-0">
            {moreProjects.map((p) => (
              <li
                key={p.name}
                className="flex min-h-[52px] flex-wrap items-center justify-between gap-x-4 border-b border-line py-1.5"
              >
                <span className="min-w-0 text-[15px]">
                  {p.name} <span className="text-muted">— {p.detail}</span>
                </span>
                {p.link && (
                  <a href={p.link.href} className="link-mono" aria-label={`${p.name}: ${p.link.label.replace(" ↗", "")}`}>
                    {p.link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="rec" className="pt-20">
          <h2 id="rec" className={sectionTitle}>
            Recognition
          </h2>
          <ul className="m-0 list-none p-0">
            {recognition.map((r) => (
              <li key={r.name} className="border-b border-line py-4">
                <span className="font-medium">{r.name}</span> <span className="text-muted">— {r.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how" className="pt-20">
          <h2 id="how" className="label mt-0 mb-4">
            How I work
          </h2>
          <p className="m-0 text-lg leading-[1.65] text-pretty">{howIWork}</p>
        </section>
      </main>

      <footer className="relative mx-auto max-w-[680px] px-6 pt-24 pb-10">
        <div className="flex flex-col gap-5 border-t border-line pt-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <TrackedLink
              href={LINKS.email}
              event={{ name: "Email click", location: "footer" }}
              className="inline-flex min-h-11 items-center text-xl font-medium text-ink no-underline"
            >
              {EMAIL}
            </TrackedLink>
            <CopyEmailButton
              location="footer"
              className="btn px-3 font-mono text-xs leading-none font-medium text-muted hover:text-ink"
            />
          </div>
          <nav aria-label="Elsewhere" className="flex flex-wrap gap-x-5">
            <TrackedLink href={RESUME_PATH} event={{ name: "Resume click", location: "footer" }} className="link-mono">
              Resume
            </TrackedLink>
            <a href={LINKS.github} className="link-mono">
              GitHub ↗
            </a>
            <a href={LINKS.linkedin} className="link-mono">
              LinkedIn ↗
            </a>
          </nav>
          <p className="m-0 font-mono text-xs leading-[1.7] text-muted">
            Built with Next.js, hosted on Vercel · Last updated {BUILD_DATE}
          </p>
        </div>
      </footer>
    </div>
  );
}
