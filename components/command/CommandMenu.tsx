"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { copyEmail } from "@/components/CopyEmailButton";
import { trackEvent } from "@/lib/analytics";
import type { PaletteCase } from "@/lib/palette";
import { EMAIL, LINKS, RESUME_PATH } from "@/lib/site";
import { toggleTheme } from "@/lib/theme";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cases: PaletteCase[];
  onToast: (text: string) => void;
};

type Item = { label: string; hint: string; icon: string; run: () => void };

export default function CommandMenu({ open, onOpenChange, cases, onToast }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const close = () => onOpenChange(false);
  const goTo = (c: PaletteCase): Item => ({
    label: `Go to ${c.title}`,
    hint: "Case study",
    icon: "→",
    run: () => {
      close();
      router.push(c.href);
    },
  });
  const external = (label: string, hint: string, href: string): Item => ({
    label,
    hint,
    icon: "↗",
    run: () => {
      close();
      window.open(href, "_blank", "noopener");
    },
  });
  const bySlug = (slug: string) => cases.find((c) => c.slug === slug);
  const featured = bySlug("ku-campus-map");
  const rest = cases.filter((c) => c !== featured);

  // Order follows the design: the 3D map first, then contact, then the other case studies.
  const items: Item[] = [
    ...(featured ? [goTo(featured)] : []),
    {
      label: "Copy email",
      hint: EMAIL,
      icon: "@",
      run: () => {
        copyEmail("command-menu");
        close();
        onToast("Copied");
      },
    },
    {
      label: "Download resume",
      hint: "PDF",
      icon: "↓",
      run: () => {
        trackEvent({ name: "Resume click", location: "command-menu" });
        const a = document.createElement("a");
        a.href = RESUME_PATH;
        a.download = "Krit-Poka-Resume.pdf";
        a.click();
        close();
        onToast("Resume downloading");
      },
    },
    ...rest.map(goTo),
    external("Open GitHub", "github.com/kritpoka", LINKS.github),
    external("Open LinkedIn", "linkedin.com", LINKS.linkedin),
    {
      label: "Toggle dark mode",
      hint: "Theme",
      icon: "◐",
      run: () => {
        toggleTheme();
        close();
      },
    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-scrim" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-24 left-1/2 z-[51] w-[min(560px,calc(100%-32px))] -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-raise text-ink shadow-card"
        >
          <Dialog.Title className="sr-only-live">Command menu</Dialog.Title>
          <Command label="Commands" loop>
            <div className="flex items-center gap-3 border-b border-line pr-1.5 pl-[18px]">
              <span aria-hidden="true" className="font-mono text-sm leading-none font-medium text-accent">
                ›
              </span>
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Type a command or search…"
                className="h-[54px] min-w-0 flex-1 border-0 bg-transparent font-sans text-base text-ink outline-none placeholder:text-muted"
              />
              <Dialog.Close className="grid min-h-11 min-w-11 cursor-pointer place-items-center border-0 bg-transparent p-0">
                <span className="rounded border border-line bg-paper px-2 py-[7px] font-mono text-[11px] leading-none font-medium text-muted">
                  esc
                </span>
                <span className="sr-only-live">Close command menu</span>
              </Dialog.Close>
            </div>
            <Command.List className="max-h-[360px] overflow-auto p-1.5">
              <Command.Empty className="px-3 py-3.5 text-sm text-muted">
                No commands match “{query}”.
              </Command.Empty>
              {items.map((item) => (
                <Command.Item
                  key={item.label}
                  value={item.label}
                  onSelect={item.run}
                  className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 data-[selected=true]:bg-surface"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span aria-hidden="true" className="w-4 text-center font-mono text-[13px] leading-none font-medium text-muted">
                      {item.icon}
                    </span>
                    <span className="text-[15px]">{item.label}</span>
                  </span>
                  <span className="truncate font-mono text-xs leading-none text-muted">{item.hint}</span>
                </Command.Item>
              ))}
            </Command.List>
            <div aria-hidden="true" className="flex gap-4 border-t border-line px-[18px] py-2.5 font-mono text-[11px] leading-none text-muted">
              <span>↑↓ move</span>
              <span>↵ run</span>
              <span>esc close</span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
