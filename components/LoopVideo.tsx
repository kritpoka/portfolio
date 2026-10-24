"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

type Props = { mp4: string; webm?: string; poster: StaticImageData; alt: string; className?: string };

/**
 * Muted looping capture. Shows its poster frame first, plays only while on
 * screen, and never plays when the visitor prefers reduced motion.
 */
export default function LoopVideo({ mp4, webm, poster, alt, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster.src}
      aria-label={alt}
      className={className}
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
