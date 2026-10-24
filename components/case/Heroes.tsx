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
const PHONE = "(min-width: 1040px) 190px, 20vw";

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
              <MediaSlot media={web} placeholder="[SCREENSHOT / VIDEO] Staff dashboard — billing" sizes={WIDE} priority />
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

/** Kasetfair POS: checkout on a tablet, PromptPay QR on a phone. */
export function TabletPhoneHero({ tablet, phone, caption }: { tablet?: Media; phone?: Media; caption: string }) {
  return (
    <HeroFigure caption={caption}>
      <div className="@container relative aspect-video overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex h-full items-center justify-center px-[4.8cqw] py-[5.6cqw]">
          <div className="relative aspect-[4/3] max-h-full flex-[0_1_64.5cqw] overflow-hidden rounded-[2.4cqw] border-[max(4px,1cqw)] border-ink bg-raise">
            <MediaSlot media={tablet} placeholder="[SCREENSHOT / VIDEO] POS checkout on a tablet" sizes={WIDE} priority />
          </div>
          <div className="relative mt-[12cqw] -ml-[6cqw] aspect-[9/19] w-[17.1cqw] flex-none overflow-hidden rounded-[2.8cqw] border-[max(3px,0.7cqw)] border-ink bg-raise shadow-card">
            <MediaSlot media={phone} placeholder="[SCREENSHOT] PromptPay QR" sizes={PHONE} />
          </div>
        </div>
      </div>
    </HeroFigure>
  );
}
