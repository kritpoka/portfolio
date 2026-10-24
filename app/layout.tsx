import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import CommandMenuHost from "@/components/command/CommandMenuHost";
import { plexMono, plexSans, plexSansItalic } from "@/lib/fonts";
import { DEFAULT_DESCRIPTION, NAME, SITE_URL } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import { caseLinks } from "@/lib/work";
import "./globals.css";

// Every page is prerendered at build time; the build fails if one stops being static.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NAME} — Software engineer who designs`,
    template: `%s — ${NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: NAME,
  authors: [{ name: NAME, url: SITE_URL }],
  openGraph: { type: "website", siteName: NAME, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1d1a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} ${plexSansItalic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <CommandMenuHost cases={caseLinks} />
        <Analytics />
      </body>
    </html>
  );
}
