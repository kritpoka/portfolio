import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { instrumentSerifLazy } from "@/lib/fonts-serif-lazy";
import { caseStudies } from "@/lib/work";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className={`${instrumentSerifLazy.variable} relative min-h-dvh overflow-hidden`}>
      <div aria-hidden="true" className="dot-grid h-[760px]" />
      <nav aria-label="Site" className="relative mx-auto flex max-w-[680px] items-center justify-between gap-4 px-6 pt-6">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 font-mono text-[13px] leading-none font-medium text-ink no-underline"
        >
          ← Krit Poka
        </Link>
        <ThemeToggle />
      </nav>
      <main className="relative mx-auto max-w-[680px] px-6 pt-[88px] pb-24">
        <p className="label m-0">Error 404</p>
        <h1 className="mt-[18px] mb-0 font-serif text-[64px] leading-none font-normal tracking-[-0.01em]">Page not found</h1>
        <p className="mt-[18px] mb-0 text-[21px] leading-[1.45] text-pretty">
          There’s nothing at this address. It may have moved, or the link has a typo.
        </p>
        <nav aria-label="Pages" className="mt-10">
          <h2 className="label m-0 border-b border-line pb-3">Try one of these</h2>
          <ul className="m-0 list-none p-0">
            <li className="border-b border-line">
              <Link href="/" className="flex min-h-[52px] items-center justify-between text-[15px] text-ink no-underline">
                Home <span aria-hidden="true" className="font-mono text-accent">→</span>
              </Link>
            </li>
            {caseStudies.map(({ meta }) => (
              <li key={meta.slug} className="border-b border-line">
                <Link
                  href={`/work/${meta.slug}`}
                  className="flex min-h-[52px] items-center justify-between gap-4 text-[15px] text-ink no-underline"
                >
                  <span>
                    {meta.shortTitle} <span className="text-muted">— case study</span>
                  </span>
                  <span aria-hidden="true" className="font-mono text-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
