import type { ComponentType } from "react";
import type { CaseMeta } from "@/lib/types";
import SmartDorm, { meta as smartDorm } from "@/content/work/smart-dorm.mdx";
import KuCampusMap, { meta as kuCampusMap } from "@/content/work/ku-campus-map.mdx";
import KasetfairPos, { meta as kasetfairPos } from "@/content/work/kasetfair-pos.mdx";
import Ttb, { meta as ttb } from "@/content/work/ttb.mdx";

type CaseStudy = { meta: CaseMeta; Content: ComponentType };

// To add a case study: create content/work/<slug>.mdx and register it here.
const ALL: CaseStudy[] = [
  { meta: smartDorm, Content: SmartDorm },
  { meta: kuCampusMap, Content: KuCampusMap },
  { meta: kasetfairPos, Content: KasetfairPos },
  { meta: ttb, Content: Ttb },
].sort((a, b) => a.meta.order - b.meta.order);

export const caseStudies = ALL;

export function getCaseStudy(slug: string) {
  return ALL.find((c) => c.meta.slug === slug);
}

/** The case study after `slug`, wrapping from the last back to the first. */
export function getNextCaseStudy(slug: string) {
  const i = ALL.findIndex((c) => c.meta.slug === slug);
  return ALL[(i + 1) % ALL.length];
}

/** Plain data for client components (command menu). */
export const caseLinks = ALL.map(({ meta }) => ({
  slug: meta.slug,
  title: meta.shortTitle,
  href: `/work/${meta.slug}`,
}));
