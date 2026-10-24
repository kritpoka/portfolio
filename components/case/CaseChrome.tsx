import Link from "next/link";
import CopyEmailButton from "@/components/CopyEmailButton";
import ThemeToggle from "@/components/ThemeToggle";
import TrackedLink from "@/components/TrackedLink";
import { BUILD_DATE, EMAIL, LINKS } from "@/lib/site";

export function CaseNav({ position, total }: { position: number; total: number }) {
  return (
    <nav aria-label="Site" className="relative mx-auto flex max-w-[680px] items-center justify-between gap-4 px-6 pt-6">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 font-mono text-[13px] leading-none font-medium text-ink no-underline"
      >
        ← Krit Poka
      </Link>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs leading-none text-muted">
          Case study {position} / {total}
        </span>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export function NextProject({ href, title }: { href: string; title: string }) {
  return (
    <section aria-label="Next" className="pt-[72px]">
      <Link
        href={href}
        className="flex items-center justify-between gap-4 rounded-xl border border-line bg-raise px-6 py-[22px] text-ink no-underline hover:border-muted"
      >
        <span className="flex flex-col gap-1">
          <span className="label text-[11px]">Next project</span>
          <span className="font-serif text-[30px] leading-[1.1]">{title}</span>
        </span>
        <span aria-hidden="true" className="font-mono text-lg leading-none font-medium text-accent">
          →
        </span>
      </Link>
    </section>
  );
}

export function CaseFooter() {
  return (
    <footer className="relative mx-auto max-w-[680px] px-6 pt-14 pb-10">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-6">
        <span className="text-[15px] text-muted">Hiring for mobile or web?</span>
        <TrackedLink href={LINKS.email} event={{ name: "Email click", location: "case-footer" }} className="inline-flex min-h-11 items-center font-medium">
          {EMAIL}
        </TrackedLink>
        <CopyEmailButton
          location="case-footer"
          className="btn px-3 font-mono text-xs leading-none font-medium text-muted hover:text-ink"
        />
      </div>
      <p className="mt-4 mb-0 font-mono text-xs leading-[1.7] text-muted">
        Built with Next.js, hosted on Vercel · Last updated {BUILD_DATE}
      </p>
    </footer>
  );
}
