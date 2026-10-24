"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";

export type ProjectRowData = {
  title: string;
  subtitle?: string;
  year: string;
  href: string;
  outcome: string;
  note?: string;
  role: string;
  stack: string;
  links: { label: string; href: string }[];
  /** Confidential work has no preview. */
  caption?: string;
};

type Props = ProjectRowData & { preview?: ReactNode };

/**
 * Selected-work row. Wide screens with a mouse get a floating preview on hover
 * or focus (pure CSS, see .project-row in globals.css); everything else gets a
 * "Preview" toggle that expands the same preview inline.
 */
export default function ProjectRow({ title, subtitle, year, href, outcome, note, role, stack, links, caption, preview }: Props) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const isInternal = (h: string) => h.startsWith("/");

  return (
    <li className="project-row relative border-b border-line">
      <div className="project-row-inner -mx-3 flex flex-wrap gap-x-6 gap-y-1 rounded-lg px-3 pt-5 pb-3.5">
        <span className="flex-[0_0_72px] pt-1 font-mono text-[13px] leading-normal text-muted">{year}</span>
        <div className="min-w-0 flex-[1_1_320px]">
          <h3 className="m-0 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-lg leading-[1.4] font-medium">
            <Link href={href} className="-my-2.5 inline-block py-2.5 text-ink no-underline">
              {title}
            </Link>
            {subtitle && <span className="text-[15px] font-normal text-muted">{subtitle}</span>}
          </h3>
          <p className="mt-1 mb-0 text-[15px] leading-[1.55] text-pretty text-ink">{outcome}</p>
          {note && <p className="mt-2 mb-0 text-sm text-muted italic">“{note}”</p>}
          <p className="mt-2.5 mb-0 font-mono text-xs leading-[1.6] text-muted">
            <span className="text-ink">{role}</span> · {stack}
          </p>
          <div className="mt-0.5 flex flex-wrap gap-x-5">
            {links.map((l) =>
              isInternal(l.href) ? (
                <Link key={l.label} href={l.href} className="link-mono">
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="link-mono">
                  {l.label}
                </a>
              ),
            )}
            {preview && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="project-row-toggle inline-flex min-h-11 cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-mono text-[13px] leading-none font-medium text-muted hover:text-ink"
              >
                {expanded ? "Hide preview ▴" : "Preview ▾"}
              </button>
            )}
          </div>
          {preview && (
            <div id={panelId} hidden={!expanded} className="project-row-panel">
              <div className="relative mt-1 mb-2 aspect-[4/3] overflow-hidden rounded-[10px] border border-line bg-surface">
                {expanded && preview}
              </div>
            </div>
          )}
        </div>
      </div>
      {preview && (
        <div
          aria-hidden="true"
          className="project-row-gutter absolute top-3 left-[calc(100%+40px)] z-[3] w-[300px] rounded-xl border border-line bg-raise p-1.5 shadow-card"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface">{preview}</div>
          <p className="m-0 px-1.5 pt-2 pb-1 font-mono text-[11px] leading-[1.4] text-muted">{caption}</p>
        </div>
      )}
    </li>
  );
}
