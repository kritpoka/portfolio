// The command menu lives once in the root layout; anything can open it with this event.
export const OPEN_PALETTE_EVENT = "kp:open-palette";

export function openPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}

export type PaletteCase = { slug: string; title: string; href: string };
