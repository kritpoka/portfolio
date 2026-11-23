"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ViewerShot } from "./ShotLightbox";

// The dialog only downloads the first time a screenshot is opened.
const ShotLightbox = dynamic(() => import("./ShotLightbox"), { ssr: false });

/**
 * Click-to-enlarge for <ShotGrid> buttons. Listens for clicks on any
 * [data-shot] element, so the grids themselves stay server-rendered.
 * Pages without screenshots never load the dialog.
 */
export default function ShotViewer() {
  const [state, setState] = useState<{ shots: ViewerShot[]; index: number } | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-shot]");
      if (!target) return;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-shot]"));
      const shots = nodes.map(({ dataset: d }) => ({
        src: d.src ?? "",
        width: Number(d.width),
        height: Number(d.height),
        alt: d.alt ?? "",
        caption: d.caption ?? "",
      }));
      setState({ shots, index: Math.max(0, nodes.indexOf(target)) });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!state) return null;
  return (
    <ShotLightbox
      shots={state.shots}
      index={state.index}
      onIndexChange={(index) => setState((s) => s && { ...s, index })}
      onClose={() => setState(null)}
    />
  );
}
