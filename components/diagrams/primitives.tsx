import type { ReactNode } from "react";

// Building blocks for the self-drawn, generic architecture diagrams.

export function DiagramFrame({ caption, label, children }: { caption?: ReactNode; label: string; children: ReactNode }) {
  return (
    <figure
      aria-label={label}
      className="mx-0 mt-0 mb-5 rounded-xl border border-line bg-surface bg-[radial-gradient(var(--dot)_1px,transparent_1.3px)] bg-[length:16px_16px] p-5 sm:p-7"
    >
      {children}
      {caption && <figcaption className="mt-4 font-mono text-xs leading-normal text-muted">{caption}</figcaption>}
    </figure>
  );
}

type NodeProps = {
  title: string;
  sub: ReactNode;
  /** "focus" = the part this case study is about (ink border); "unverified" = dashed. */
  tone?: "default" | "focus" | "unverified";
};

export function Node({ title, sub, tone = "default" }: NodeProps) {
  const border =
    tone === "focus" ? "border-ink" : tone === "unverified" ? "border-dashed border-muted" : "border-line";
  return (
    <div className={`rounded-lg border bg-raise px-3.5 py-3 ${border}`}>
      <div className="font-mono text-xs leading-[1.4] font-medium">{title}</div>
      <div className="text-[13px] leading-normal text-muted">{sub}</div>
    </div>
  );
}

export function Stack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2.5">{children}</div>;
}

/** Points right on wide screens and down when the diagram stacks on phones. */
export function Arrow({ both = false }: { both?: boolean }) {
  return (
    <div aria-hidden="true" className="py-1 text-center font-mono text-sm leading-none font-medium text-muted min-[560px]:py-0">
      <span className="min-[560px]:hidden">{both ? "⇅" : "↓"}</span>
      <span className="hidden min-[560px]:inline">{both ? "⇄" : "→"}</span>
    </div>
  );
}

/** Horizontal flow that becomes a vertical one below 560px. `cols` is a grid-template-columns value. */
export function Flow({ cols, children }: { cols: string; children: ReactNode }) {
  return (
    <div
      className="flex flex-col gap-1 min-[560px]:grid min-[560px]:items-center min-[560px]:gap-0 min-[560px]:[grid-template-columns:var(--cols)]"
      style={{ "--cols": cols } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
