"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import type { KeyboardEvent } from "react";

export type ViewerShot = { src: string; width: number; height: number; alt: string; caption: string };

type Props = {
  shots: ViewerShot[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/** Full-screen screenshot viewer with previous / next and a counter. */
export default function ShotLightbox({ shots, index, onIndexChange, onClose }: Props) {
  const total = shots.length;
  const shot = shots[index];
  const step = (by: number) => onIndexChange((index + by + total) % total);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-50 flex flex-col bg-[rgba(20,19,17,0.94)] outline-none"
        >
          <Dialog.Title className="sr-only-live">Screenshot viewer</Dialog.Title>
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <span aria-live="polite" className="font-mono text-xs leading-normal text-[#ECE9E2]">
              {index + 1} / {total}
            </span>
            <span className="flex gap-2">
              <button type="button" className="btn min-w-11 justify-center" aria-label="Previous screenshot" onClick={() => step(-1)}>
                ←
              </button>
              <button type="button" className="btn min-w-11 justify-center" aria-label="Next screenshot" onClick={() => step(1)}>
                →
              </button>
              <Dialog.Close className="btn text-sm" aria-label="Close viewer">
                Close ✕
              </Dialog.Close>
            </span>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto px-5 pb-7">
            <figure className="m-0 w-full max-w-[1280px]">
              <Image
                key={shot.src}
                src={shot.src}
                width={shot.width}
                height={shot.height}
                alt={shot.alt}
                sizes="(min-width: 1320px) 1280px, calc(100vw - 40px)"
                className="mx-auto block h-auto max-h-[calc(100vh-150px)] w-auto max-w-full rounded-lg"
              />
              {shot.caption && (
                <figcaption className="mt-3.5 text-center text-sm leading-normal text-[#CFCBC2]">{shot.caption}</figcaption>
              )}
            </figure>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
