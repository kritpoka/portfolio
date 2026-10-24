"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { OPEN_PALETTE_EVENT, type PaletteCase } from "@/lib/palette";

// cmdk + the dialog only download the first time the menu is opened.
const CommandMenu = dynamic(() => import("./CommandMenu"), { ssr: false });

export default function CommandMenuHost({ cases }: { cases: PaletteCase[] }) {
  const [open, setOpen] = useState(false);
  // Bumped on every open so the menu starts with an empty query.
  const [session, setSession] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) setSession((n) => n + 1);
          return !o;
        });
      }
    };
    const onOpen = () => {
      setSession((n) => n + 1);
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
      clearTimeout(timer.current);
    };
  }, []);

  const flash = useCallback((text: string) => {
    setToast(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  return (
    <>
      {session > 0 && <CommandMenu key={session} open={open} onOpenChange={setOpen} cases={cases} onToast={flash} />}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center">
        {toast && (
          <span aria-hidden="true" className="toast">
            <span className="text-accent-on-ink">✓</span>
            {toast}
          </span>
        )}
      </div>
      <span role="status" aria-live="polite" className="sr-only-live">
        {toast ?? ""}
      </span>
    </>
  );
}
