import { reveal } from "@/components/reveal";
import type { CaseMeta } from "@/lib/types";
import { MaybePh, isPlaceholder } from "./Ph";

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="label text-[11px]">{term}</dt>
      <dd className={"mt-2 mb-0 text-[15px] leading-normal" + (isPlaceholder(value) ? " leading-[1.4]" : "")}>
        <MaybePh text={value} />
      </dd>
    </div>
  );
}

export default function CaseHeader({ meta }: { meta: CaseMeta }) {
  return (
    <header className="relative mx-auto max-w-[680px] px-6 pt-[72px] pb-10">
      <p {...reveal(0)} className="label m-0">
        Case study · <MaybePh text={meta.year} /> · {meta.readTime}
      </p>
      <h1
        {...reveal(1, "rise")}
        className={
          "mt-[18px] mb-0 font-serif font-normal tracking-[-0.01em] text-balance " +
          (meta.longTitle ? "text-[clamp(36px,8vw,48px)] leading-[1.08]" : "text-[clamp(48px,13vw,64px)] leading-none")
        }
      >
        {meta.title}
      </h1>
      <p {...reveal(2, "rise")} className="mt-[18px] mb-0 text-[clamp(19px,4.6vw,21px)] leading-[1.45] text-pretty">
        {meta.summary}
      </p>
      <dl
        {...reveal(3)}
        className="mt-8 mb-0 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-5 border-t border-line pt-5"
      >
        <Fact term="Role" value={meta.role} />
        {meta.team && <Fact term="Team" value={meta.team} />}
        <Fact term="Timeline" value={meta.timeline} />
        <div className="col-span-full">
          <dt className="label text-[11px]">Stack</dt>
          <dd className="mt-2.5 mb-0 flex flex-wrap gap-1.5">
            {meta.stack.map((s) => (
              <span key={s} className="pill">
                {s}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <div {...reveal(4)} className="mt-7 flex flex-wrap gap-2">
        {meta.linksNote && (
          <span className="inline-flex min-h-11 items-center font-mono text-xs leading-none text-muted">{meta.linksNote}</span>
        )}
        {meta.links.map((l) =>
          l.href ? (
            <a key={l.label} href={l.href} className="btn font-mono text-[13px] leading-none font-medium">
              {l.label} <span aria-hidden="true" className="text-accent">↗</span>
            </a>
          ) : (
            <span
              key={l.label}
              className="inline-flex min-h-11 items-center rounded-lg border border-dashed border-muted px-3.5 font-mono text-xs leading-none font-medium text-muted"
            >
              {l.label} [LINK]
            </span>
          ),
        )}
      </div>
      {meta.note && (
        <div
          {...reveal(5)}
          role="note"
          className="mt-7 flex items-start gap-3 rounded-[10px] border border-line bg-surface px-4 py-3.5"
        >
          <span className="label flex-none text-[11px] leading-[1.9]">{meta.note.label}</span>
          <span className="text-[15px] leading-[1.6]">{meta.note.text}</span>
        </div>
      )}
    </header>
  );
}
