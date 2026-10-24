import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { caseStudies, getCaseStudy } from "@/lib/work";

export const alt = "Krit Poka — case study";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return caseStudies.map(({ meta }) => ({ slug: meta.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getCaseStudy(slug)?.meta;
  if (!meta) return renderOgImage({ eyebrow: "Case study", title: "Krit Poka", subtitle: "" });
  const year = meta.year.startsWith("[") ? "" : ` · ${meta.year}`;
  return renderOgImage({
    eyebrow: `Case study${year}`,
    title: meta.title,
    subtitle: meta.summary,
    serif: true,
  });
}
