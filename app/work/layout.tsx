import { instrumentSerif } from "@/lib/fonts-serif";

export default function WorkLayout({ children }: LayoutProps<"/work">) {
  return <div className={instrumentSerif.variable}>{children}</div>;
}
