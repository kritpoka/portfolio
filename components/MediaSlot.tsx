import Image, { type StaticImageData } from "next/image";
import LoopVideo from "./LoopVideo";

export type Media =
  | { type: "image"; src: StaticImageData; alt: string }
  | { type: "video"; mp4: string; webm?: string; poster: StaticImageData; alt: string };

type Props = {
  media?: Media;
  /** Shown as a dashed "[SCREENSHOT] …" chip until real media is added. Listed in README. */
  placeholder: string;
  sizes: string;
  priority?: boolean;
};

/**
 * Fills its (relatively positioned) parent. With no media it renders a clearly
 * marked placeholder instead of an invented image.
 */
export default function MediaSlot({ media, placeholder, sizes, priority }: Props) {
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
      priority={priority}
      placeholder="blur"
      className="object-cover object-top"
    />
  );
}
