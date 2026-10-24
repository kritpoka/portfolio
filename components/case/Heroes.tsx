import MediaSlot, { type Media } from "@/components/MediaSlot";
import { reveal } from "@/components/reveal";

// Hero figures sit outside the 680px text column (max 1040px). Device frames are
// sized in container-query units (cqw) so the composition scales down to 360px.

function HeroFigure({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure {...reveal(5)} className="relative mx-auto mt-0 mb-6 max-w-[1040px] px-6">
      {children}
      <figcaption className="mt-3 font-mono text-xs leading-normal text-muted">{caption}</figcaption>
    </figure>
  );
}

const WIDE = "(min-width: 1040px) 720px, 75vw";
const PHONE = "(min-width: 1040px) 240px, 24vw";

/** Smart Dorm: staff dashboard in a browser window, resident app on a phone in front. */
export function BrowserPhoneHero({ web, app, caption }: { web?: Media; app?: Media; caption: string }) {
  return (
    <HeroFigure caption={caption}>
      <div className="@container relative aspect-video overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex h-full items-end justify-center px-[4.8cqw] pt-[4.8cqw]">
          <div className="relative flex h-[88%] max-w-[72cqw] flex-auto flex-col overflow-hidden rounded-t-[10px] border border-b-0 border-line bg-raise">
            <div aria-hidden="true" className="flex gap-1.5 border-b border-line px-3 py-[max(6px,1cqw)]">
              <span className="size-[9px] rounded-full bg-line" />
              <span className="size-[9px] rounded-full bg-line" />
              <span className="size-[9px] rounded-full bg-line" />
            </div>
            <div className="relative flex-1">
              <MediaSlot media={web} placeholder="[SCREENSHOT / VIDEO] Staff dashboard — billing" sizes={WIDE} />
            </div>
          </div>
          <div className="relative -mb-[6cqw] -ml-[8cqw] aspect-[9/19] w-[19.2cqw] flex-none overflow-hidden rounded-[3cqw] border-[max(3px,0.7cqw)] border-ink bg-raise shadow-card">
            <MediaSlot media={app} placeholder="[SCREENSHOT] Resident app" sizes={PHONE} />
          </div>
        </div>
      </div>
    </HeroFigure>
  );
}

/**
 * Kasetfair POS: three phone screenshots side by side, the middle one raised.
 * Phones keep the screenshots' own aspect ratio.
 */
export function PhonesHero({ phones, caption }: { phones: [Media, Media, Media]; caption: string }) {
  return (
    <HeroFigure caption={caption}>
      <div className="@container relative aspect-video overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex h-full items-start justify-center gap-[3.5cqw] px-[4.8cqw] pt-[5cqw]">
          {phones.map((phone, i) => (
            <div
              key={phone.alt}
              className={
                "relative aspect-[780/1480] flex-none overflow-hidden rounded-[2.8cqw] border-[max(3px,0.7cqw)] border-ink bg-ink shadow-card " +
                (i === 1 ? "w-[24cqw]" : "mt-[6cqw] w-[21cqw]")
              }
            >
              <MediaSlot media={phone} placeholder="[SCREENSHOT]" sizes={PHONE} />
            </div>
          ))}
        </div>
      </div>
    </HeroFigure>
  );
}
