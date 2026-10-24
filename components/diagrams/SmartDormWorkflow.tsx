import { reveal } from "@/components/reveal";

// Before/after billing workflow for Smart Dorm. Real text in ordered lists, so it
// reads in order for screen readers; panels sit side by side on wide screens and
// stack on phones.

const BEFORE = [
  "Copy last month's Excel",
  "Update each resident by hand",
  "Email each bill",
  "No way to see who has paid",
];

const AFTER = [
  "One resident record",
  "Generate the month's bills",
  "Residents see their bill",
  "Staff see each bill's status",
];

function Panel({ title, steps, tone }: { title: string; steps: string[]; tone: "before" | "after" }) {
  const after = tone === "after";
  return (
    <section
      aria-label={title}
      className={
        "flex flex-col rounded-xl border bg-surface/60 p-4 sm:p-5 " + (after ? "border-ink" : "border-dashed border-muted")
      }
    >
      <h3 className="label m-0 mb-3.5 text-[11px]">{title}</h3>
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={step} className="flex flex-col gap-1.5">
              {i > 0 && (
                <span aria-hidden="true" className="text-center font-mono text-sm leading-none font-medium text-muted">
                  ↓
                </span>
              )}
              <div
                className={
                  "flex items-baseline gap-3 rounded-lg border px-3.5 py-3 " +
                  (!after && last ? "border-dashed border-muted bg-surface" : "border-line bg-raise")
                }
              >
                <span aria-hidden="true" className="font-mono text-[11px] leading-none font-medium text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={"text-[15px] leading-[1.4] " + (after && last ? "font-medium" : "")}>
                  {step}
                  {after && last && (
                    <span aria-hidden="true" className="ml-2 text-accent">
                      ✓
                    </span>
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Case study hero, in place of a screenshot. */
export function SmartDormWorkflowHero({ caption }: { caption: string }) {
  return (
    <figure {...reveal(5)} className="relative mx-auto mt-0 mb-6 max-w-[1040px] px-6">
      <div
        role="group"
        aria-label="Smart Dorm billing workflow, before and after"
        className="grid gap-4 rounded-2xl border border-line bg-surface bg-[radial-gradient(var(--dot)_1px,transparent_1.3px)] bg-[length:16px_16px] p-4 min-[720px]:grid-cols-2 min-[720px]:gap-6 min-[720px]:p-8"
      >
        <Panel title="Before — Excel and email" steps={BEFORE} tone="before" />
        <Panel title="After — one system" steps={AFTER} tone="after" />
      </div>
      <figcaption className="mt-3 font-mono text-xs leading-normal text-muted">{caption}</figcaption>
    </figure>
  );
}

/** Compact version for the homepage row preview (fills a 4:3 box). */
export function SmartDormWorkflowPreview() {
  const col = (title: string, steps: string[], after: boolean) => (
    <div className={"flex min-w-0 flex-1 flex-col gap-1 rounded-md border p-1.5 " + (after ? "border-ink" : "border-dashed border-muted")}>
      <span className="font-mono text-[9px] leading-none font-medium tracking-[0.06em] text-muted uppercase">{title}</span>
      <ol className="m-0 flex list-none flex-col gap-1 p-0">
        {steps.map((s) => (
          <li key={s} className="rounded border border-line bg-raise px-1.5 py-1 text-[10px] leading-[1.25]">
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
  return (
    <div className="absolute inset-0 flex gap-1.5 bg-surface p-2">
      {col("Before", BEFORE, false)}
      {col("After", AFTER, true)}
    </div>
  );
}
