import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Krit Poka — Software engineer who designs. Flutter, Next.js, and the UX in between.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Kasetsart University CS · Bangkok",
    title: "Krit Poka",
    subtitle: "Software engineer who designs — Flutter, Next.js, and the UX in between.",
  });
}
