import type { Media } from "@/components/MediaSlot";
import { media } from "@/content/media";
import type { ProjectRowData } from "@/components/home/ProjectRow";
import { LINKS } from "@/lib/site";

// Homepage copy from the design (Home.dc.html). Facts only; anything unknown stays a [PLACEHOLDER].

type SelectedWork = ProjectRowData & {
  /** Hover / tap preview. Omit for confidential work. */
  preview?: { placeholder: string; media?: Media } | { diagram: "smart-dorm-workflow" };
};

const caseLink = (slug: string) => ({ label: "Case study →", href: `/work/${slug}` });

export const selectedWork: SelectedWork[] = [
  {
    title: "Smart Dorm",
    year: "2025–2026",
    href: "/work/smart-dorm",
    outcome:
      "Replaced a dorm office's Excel-and-email billing with one system where staff and residents can see every bill's status. Usability-tested with the real dorm staff.",
    role: "UX/UI, workflow + front-end, team of 4",
    stack: "Figma · Next.js · Spring Boot · Flutter (follow-up app)",
    links: [caseLink("smart-dorm")],
    caption: "Monthly billing, before and after",
    preview: { diagram: "smart-dorm-workflow" },
  },
  {
    title: "KU Campus Map",
    year: "2026",
    href: "/work/ku-campus-map",
    outcome:
      "3D interactive map of KU Bangkhen — tappable landmarks, search, category filter, shuttle routes, in Thai and English.",
    role: "Solo — product, design direction, data review and testing; code written with Claude Code (AI-assisted)",
    stack: "React · Vite · Three.js · OpenStreetMap",
    links: [
      caseLink("ku-campus-map"),
      { label: "Live ↗", href: LINKS.kuMap },
      { label: "Code ↗", href: LINKS.kuMapCode },
    ],
    caption: "ku-map-beta.vercel.app",
    preview: {
      placeholder: "[SCREENSHOT] 3D campus view",
      media: {
        type: "image",
        src: media.kuMapShare,
        alt: "KU Bangkhen Campus Map: the 3D campus with labelled landmarks",
        position: "left",
      },
    },
  },
  {
    title: "Kasetfair POS",
    year: "2026",
    href: "/work/kasetfair-pos",
    outcome:
      "Phone-first POS for a Kaset Fair stall — orders, PromptPay QR payments, a dashboard that reflects every order, and sign-in so only signed-in staff can read or change data.",
    role: "Solo — design and engineering",
    stack: "Next.js · TypeScript · Supabase · Zustand",
    links: [
      caseLink("kasetfair-pos"),
      { label: "Live ↗", href: LINKS.kasetfairPos },
      { label: "Code ↗", href: LINKS.kasetfairPosCode },
    ],
    caption: "ku-media-pos.vercel.app",
    preview: {
      placeholder: "[SCREENSHOT] POS checkout + QR",
      media: {
        type: "image",
        src: media.posDashboard,
        alt: "Kasetfair POS dashboard on a phone: order count, total sales and average sale per bill, with test orders",
        fit: "contain",
      },
    },
  },
  {
    title: "ttb",
    subtitle: "Software Engineer Tech Intern",
    year: "2026",
    href: "/work/ttb",
    outcome:
      "Internal developer tools, an activity log for Business Analysis and platform features for the tablet platform team.",
    note: "Internal banking work — details under confidentiality.",
    role: "Tech Intern",
    stack: "Flutter · Clean Architecture · BLoC · Firebase · CI with Fastlane, Melos and Jenkins",
    links: [caseLink("ttb")],
  },
];

export const experience = [
  {
    when: "May–Oct 2026",
    title: "Software Engineer Tech Intern, ttb (TMBThanachart Bank)",
    detail: "ttb spark Tech & Data Internship · Tablet Platform Digital Solution team",
  },
  {
    when: "2025",
    title: "Co-founder, Vice President & Treasurer, KU Media Production Club",
    detail: "Set up club workflows, planned major activities, managed the annual budget.",
  },
  {
    when: "Apr–Jun 2024",
    title: "UX/UI Intern, Kasetsart University",
    detail: "Redesigned the KU Meeting website for clearer navigation and consistent UI.",
  },
];

export const moreProjects: { name: string; detail: string; link?: { label: string; href: string } }[] = [
  { name: "KU Media Website", detail: "Next.js, JWT, MySQL in Docker", link: { label: "Code ↗", href: LINKS.kuMedia } },
  { name: "Qwiksell", detail: "Flutter + Firebase mobile POS", link: { label: "Code ↗", href: LINKS.qwiksell } },
  { name: "KU Request Submission System", detail: "JavaFX, 5 roles, team of 4" },
  { name: "Study Cafe", detail: "Next.js", link: { label: "Live ↗", href: LINKS.studyCafe } },
  { name: "UX/UI designs", detail: "KU Meeting, KU SD, KU Competency, KU Store, KU-TUTOR" },
];

export const recognition = [
  { name: "MHESI First Place Award", detail: "Student Service category" },
  { name: "SUN Thailand Recognition Award", detail: "excellence in student-focused digital solutions" },
  { name: "KUSA Student Activity Award 2024", detail: "UX/UI design, Kasetsart University" },
];

export const howIWork =
  "I design in Figma, prototype in code, and ship with tests and CI. I start with the people using the thing — a usability session, or a spreadsheet a team has outgrown — and sketch until the flow feels obvious. Then I build it in Flutter or Next.js with clear layers, so the design survives contact with real data. Lint, unit tests and a pipeline gate every merge, because craft that doesn't ship doesn't count.";
