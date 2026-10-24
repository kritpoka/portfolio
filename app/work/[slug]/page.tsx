import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrackView from "@/components/TrackView";
import { CaseFooter, CaseNav, NextProject } from "@/components/case/CaseChrome";
import CaseHeader from "@/components/case/CaseHeader";
import { caseStudies, getCaseStudy, getNextCaseStudy } from "@/lib/work";

export function generateStaticParams() {
  return caseStudies.map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const { meta } = study;
  return {
    title: meta.shortTitle === meta.title ? `${meta.title} — case study` : meta.shortTitle,
    description: meta.description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { type: "article", title: meta.title, description: meta.description, url: `/work/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const { meta, Content } = study;
  const next = getNextCaseStudy(slug);

  return (
    <div className="relative min-h-full overflow-hidden text-[17px] leading-[1.7]">
      <TrackView event={{ name: "Case study open", slug }} />
      <div aria-hidden="true" className="dot-grid h-[900px]" />
      <CaseNav position={meta.order} total={caseStudies.length} />
      <CaseHeader meta={meta} />
      <main className="relative pb-0">
        <Content />
        <div className="mx-auto max-w-[680px] px-6">
          <NextProject href={`/work/${next.meta.slug}`} title={next.meta.shortTitle} />
        </div>
      </main>
      <CaseFooter />
    </div>
  );
}
