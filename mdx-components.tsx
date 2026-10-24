import type { MDXComponents } from "mdx/types";
import { Decision, Findings, Outcome, Section } from "@/components/case/Blocks";
import { BrowserPhoneHero, PhonesHero } from "@/components/case/Heroes";
import MapPreview from "@/components/case/MapPreview";
import { Ph } from "@/components/case/Ph";
import { PhoneShots, Screenshot } from "@/components/case/Shots";
import {
  CiPipelineDiagram,
  CleanArchitectureDiagram,
  KasetfairPosDiagram,
  KuCampusMapDiagram,
  SmartDormDiagram,
} from "@/components/diagrams";

// Markdown elements styled to the case-study template, plus every template
// component, so content/work/*.mdx files need no imports.
const components = {
  p: (props) => <p className="mt-0 mb-3.5 text-pretty" {...props} />,
  ul: (props) => <ul className="m-0 flex list-disc flex-col gap-2.5 pl-5 marker:text-muted" {...props} />,
  ol: (props) => <ol className="m-0 flex list-decimal flex-col gap-2.5 pl-5 marker:text-muted" {...props} />,
  strong: (props) => <strong className="font-medium" {...props} />,
  h3: (props) => <h3 className="mt-7 mb-2.5 text-lg font-medium" {...props} />,
  a: (props) => <a {...props} />,
  Section,
  Findings,
  Decision,
  Outcome,
  Ph,
  BrowserPhoneHero,
  PhonesHero,
  Screenshot,
  PhoneShots,
  MapPreview,
  SmartDormDiagram,
  KuCampusMapDiagram,
  KasetfairPosDiagram,
  CleanArchitectureDiagram,
  CiPipelineDiagram,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
