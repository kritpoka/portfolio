import Image, { type StaticImageData } from "next/image";

// Screenshots inside the 680px text column.

type Shot = { image: StaticImageData; alt: string; caption?: string };

/** One desktop screenshot with a thin frame and an optional caption. */
export function Screenshot({ image, alt, caption }: Shot) {
  return (
    <figure className="mx-0 mt-2 mb-6">
      <Image
        src={image}
        alt={alt}
        sizes="(min-width: 680px) 632px, calc(100vw - 48px)"
        placeholder={image.blurDataURL ? "blur" : "empty"}
        className="h-auto w-full rounded-[10px] border border-line"
      />
      {caption && <figcaption className="mt-2.5 font-mono text-xs leading-normal text-muted">{caption}</figcaption>}
    </figure>
  );
}

type GridShot = Shot & {
  /** Short name for the "Enlarge: …" button label. */
  label: string;
  /** Caption in the viewer, when it should differ from the grid caption. */
  viewerCaption?: string;
};

/**
 * Desktop screenshots in a grid that breaks out of the text column to 1040px.
 * Each one opens in <ShotViewer> (mounted by the case page), which steps
 * through every [data-shot] on the page in order.
 */
export function ShotGrid({ shots, single }: { shots: GridShot[]; single?: boolean }) {
  return (
    <div
      className={
        "relative left-1/2 mt-6 mb-3 grid w-[min(1040px,calc(100vw-48px))] -translate-x-1/2 gap-x-5 gap-y-6 " +
        (single ? "grid-cols-1" : "grid-cols-[repeat(auto-fit,minmax(260px,1fr))]")
      }
    >
      {shots.map((s) => (
        <button
          key={s.label}
          type="button"
          aria-haspopup="dialog"
          aria-label={`Enlarge: ${s.label}`}
          data-shot=""
          data-src={s.image.src}
          data-width={s.image.width}
          data-height={s.image.height}
          data-alt={s.alt}
          data-caption={s.viewerCaption ?? s.caption ?? ""}
          className="group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left text-ink"
        >
          <span
            className={
              "block overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_1px_2px_rgba(28,27,24,0.06)] group-hover:border-muted " +
              (single ? "aspect-video" : "aspect-[16/10]")
            }
          >
            <Image
              src={s.image}
              alt={s.alt}
              sizes={
                single
                  ? "(min-width: 1088px) 1040px, calc(100vw - 48px)"
                  : "(min-width: 1088px) 334px, (min-width: 868px) calc((100vw - 88px) / 3), (min-width: 588px) calc((100vw - 68px) / 2), calc(100vw - 48px)"
              }
              placeholder={s.image.blurDataURL ? "blur" : "empty"}
              className="block size-full object-cover object-left-top"
            />
          </span>
          {s.caption && <span className="mt-2.5 block text-sm leading-normal text-muted">{s.caption}</span>}
        </button>
      ))}
    </div>
  );
}

/** Phone screenshots in device frames, two or three across. */
export function PhoneShots({ shots }: { shots: Shot[] }) {
  return (
    <div className="mt-2 mb-6 grid grid-cols-2 gap-x-4 gap-y-6 min-[560px]:grid-cols-[repeat(auto-fill,minmax(150px,210px))]">
      {shots.map((s) => (
        <figure key={s.alt} className="m-0">
          <div className="overflow-hidden rounded-[22px] border-[5px] border-ink bg-ink">
            <Image
              src={s.image}
              alt={s.alt}
              sizes="(min-width: 680px) 210px, 45vw"
              placeholder={s.image.blurDataURL ? "blur" : "empty"}
              className="block h-auto w-full"
            />
          </div>
          {s.caption && <figcaption className="mt-2.5 font-mono text-xs leading-normal text-muted">{s.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
