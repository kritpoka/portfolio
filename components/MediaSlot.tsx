import Image, { type StaticImageData } from "next/image";
import LoopVideo from "./LoopVideo";

export type Media =
  | {
      type: "image";
      src: StaticImageData;
      alt: string;
      /** "contain" centres the whole image (e.g. a phone screenshot in a 4:3 box). Default "cover". */
      fit?: "cover" | "contain";
      /** CSS object-position for "cover". Default "top". */
      position?: string;
    }
  | { type: "video"; mp4: string; webm?: string; poster: StaticImageData; alt: string };

type Props = {
  media?: Media;
  /** Shown as a dashed "[SCREENSHOT] …" chip until real media is added. Listed in README. */
  placeholder: string;
  sizes: string;
};

/**
 * Fills its (relatively positioned) parent. Always lazy, hero images included:
 * on phones the case-study title is the LCP and the hero sits below it, so
 * preloading the image measurably slowed LCP (3.1 s vs 2.8 s, Lighthouse mobile).
 * With no media it renders a clearly marked placeholder instead of an invented image.
 */
export default function MediaSlot({ media, placeholder, sizes }: Props) {
  if (!media) {
    return (
      <div
        role="img"
        aria-label={`Placeholder: ${placeholder}`}
        className="absolute inset-0 grid place-items-center bg-surface p-2 text-center sm:p-4 [background-image:repeating-linear-gradient(135deg,transparent_0_10px,color-mix(in_oklab,var(--line)_60%,transparent)_10px_11px)]"
      >
        <span className="ph inline-block max-w-full bg-raise [overflow-wrap:anywhere]">{placeholder}</span>
      </div>
    );
  }

  if (media.type === "video") {
    return <LoopVideo {...media} className="absolute inset-0 h-full w-full object-cover" />;
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      placeholder={media.src.blurDataURL ? "blur" : "empty"}
      className={media.fit === "contain" ? "object-contain p-3" : "object-cover"}
      style={media.fit === "contain" ? undefined : { objectPosition: media.position ?? "top" }}
    />
  );
}
