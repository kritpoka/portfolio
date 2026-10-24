"use client";

import { useSyncExternalStore } from "react";
import { openPalette } from "@/lib/palette";

const noop = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** Header trigger: "Jump to ⌘K" with a mouse, "Menu" on touch screens. */
export default function PaletteButton() {
  const mac = useSyncExternalStore(noop, isMac, () => true);

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-haspopup="dialog"
      aria-label="Open command menu"
      className="btn gap-2.5 pr-3 pl-3.5 font-mono text-[13px] leading-none text-muted hover:text-ink"
    >
      <span className="whitespace-nowrap [@media(hover:none)]:hidden">Jump to</span>
      <span className="hidden whitespace-nowrap [@media(hover:none)]:inline">Menu</span>
      <kbd className="rounded border border-line bg-paper px-1.5 py-1 font-mono text-[11px] leading-none font-medium text-ink [@media(hover:none)]:hidden">
        {mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
