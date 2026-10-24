"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getTheme, hasStoredTheme, setTheme, subscribeTheme, toggleTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => null);

  // Until the visitor picks a theme, keep following the OS setting.
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!hasStoredTheme()) setTheme(mq.matches ? "dark" : "light", false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const label =
    theme === null ? "Toggle dark mode" : theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className="btn min-w-11 justify-center px-3 font-mono text-[13px] leading-none"
    >
      {/* Glyph follows data-theme in CSS so the first paint is already right. */}
      <span aria-hidden="true" className="dark:hidden">
        ☾{"︎"}
      </span>
      <span aria-hidden="true" className="hidden dark:inline">
        ☀{"︎"}
      </span>
    </button>
  );
}
