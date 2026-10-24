/** A link in a case study header. Without `href` it renders as a dashed "[LINK]" placeholder. */
export type CaseLink = { label: string; href?: string };

/** Front matter exported as `meta` from every content/work/*.mdx file. */
export type CaseMeta = {
  slug: string;
  /** Position in the case study sequence ("Case study n / 4") and the next-project loop. */
  order: number;
  /** H1 on the case page. */
  title: string;
  /** Used in the next-project card, the command menu and page titles. */
  shortTitle: string;
  /** Smaller H1 for long titles (ttb). */
  longTitle?: boolean;
  /** Eyebrow date, e.g. "2026" or "May–Oct 2026". Text in [brackets] renders as a placeholder. */
  year: string;
  readTime: string;
  /** Lede under the H1. */
  summary: string;
  /** Meta description and Open Graph description. */
  description: string;
  role: string;
  team: string;
  timeline: string;
  stack: string[];
  links: CaseLink[];
  /** Shown instead of links, e.g. "Internal work — no public links". */
  linksNote?: string;
  /** Callout under the header (ttb confidentiality note). */
  note?: string;
};
