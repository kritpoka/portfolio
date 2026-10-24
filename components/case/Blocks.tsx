import type { ReactNode } from "react";
import { MaybePh, isPlaceholder } from "./Ph";

/** A numbered case-study section: "01 TL;DR". */
export function Section({ n, title, id, children }: { n: string; title: string; id?: string; children: ReactNode }) {
  const headingId = `s${n}`;
  return (
    <section id={id ?? `sec${n}`} aria-labelledby={headingId} className="mx-auto max-w-[680px] px-6 pt-14">
      <h2
        id={headingId}
        className="mt-0 mb-4 flex items-baseline gap-3.5 text-2xl leading-[1.3] font-medium tracking-[-0.01em]"
      >
        <span className="font-mono text-xs leading-none font-medium text-muted">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Research findings: F1, F2, F3 rows. */
export function Findings({ items }: { items: string[] }) {
  return (
    <ol className="m-0 list-none border-t border-line p-0">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 border-b border-line py-3.5">
          <span className="flex-none font-mono text-xs leading-[1.9] font-medium text-muted">F{i + 1}</span>
          <span className={isPlaceholder(item) ? "leading-[1.9]" : ""}>
            <MaybePh text={item} />
          </span>
        </li>
      ))}
    </ol>
  );
}

type DecisionProps = { title: string; options?: string; choice?: string; why: string };

/**
 * One decision. With options and choice it renders the Options / Choice / Why
 * grid; with only `why` it renders the reasoning as a paragraph.
 */
export function Decision({ title, options, choice, why }: DecisionProps) {
  const dt = "font-mono text-[11px] leading-[2] font-medium tracking-[0.06em] uppercase text-muted";
  if (!options || !choice) {
    return (
      <div className="border-b border-line py-5">
        <h3 className="mt-0 mb-2 text-[17px] font-medium">{title}</h3>
        <p className="m-0 text-[15px] leading-[1.6] text-pretty">{why}</p>
      </div>
    );
  }
  return (
    <div className="border-b border-line py-5">
      <h3 className="mt-0 mb-3 text-[17px] font-medium">{title}</h3>
      <dl className="m-0 grid grid-cols-[72px_minmax(0,1fr)] gap-x-4 gap-y-2 text-[15px] leading-[1.6]">
        <dt className={dt}>Options</dt>
        <dd className="m-0 text-muted">{options}</dd>
        <dt className={dt}>Choice</dt>
        <dd className="m-0 font-medium">{choice}</dd>
        <dt className={dt}>Why</dt>
        <dd className="m-0">{why}</dd>
      </dl>
    </div>
  );
}

/** Outcome tiles. A "[METRIC]" value renders as a placeholder; never invent a number. */
export function Outcome({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px overflow-hidden rounded-xl border border-line bg-line">
      {items.map((item) => (
        <div key={item.label} className="bg-raise p-[18px]">
          <div
            className={
              "font-mono text-xl leading-[1.2] font-medium " + (isPlaceholder(item.value) ? "text-muted" : "text-ink")
            }
          >
            {item.value}
          </div>
          <div className="mt-1.5 text-sm text-muted">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
