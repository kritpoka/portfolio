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
