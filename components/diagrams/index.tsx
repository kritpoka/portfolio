import { Ph } from "@/components/case/Ph";
import { Arrow, DiagramFrame, Flow, Node, Stack } from "./primitives";

export function SmartDormDiagram() {
  return (
    <DiagramFrame label="Smart Dorm architecture: resident app and web dashboards call a Spring Boot API backed by a database">
      <Flow cols="minmax(0,1.2fr) 28px minmax(0,1fr) 28px minmax(0,0.9fr)">
        <Stack>
          <Node title="Resident app" sub="Flutter · UI → BLoC → Domain → Data" />
          <Node title="Resident + staff web" sub="Next.js dashboards · billing module" />
        </Stack>
        <Arrow />
        <Node title="API" sub="Spring Boot · REST" tone="focus" />
        <Arrow />
        <Node title="Database" sub={<Ph>[VERIFY]</Ph>} tone="unverified" />
      </Flow>
    </DiagramFrame>
  );
}

export function KuCampusMapDiagram() {
  return (
    <DiagramFrame
      label="KU Campus Map architecture: OpenStreetMap data feeds a React and Vite app with a three.js scene, deployed on Vercel"
      caption="Between OSM and the scene, a script fetches the map data once through Overpass and compacts it into one TopoJSON file. The app never calls Overpass."
    >
      <Flow cols="minmax(0,1fr) 28px minmax(0,1.2fr) 28px minmax(0,1fr)">
        <Node title="OpenStreetMap" sub="Buildings, paths, POIs" />
        <Arrow />
        <Stack>
          <Node title="React + Vite app" sub="Search · category filter · TH/EN" tone="focus" />
          <Node title="Three.js scene" sub="Landmarks · shuttle routes · camera" />
        </Stack>
        <Arrow />
        <Node title="Vercel" sub="ku-map-beta.vercel.app" />
      </Flow>
    </DiagramFrame>
  );
}

export function KasetfairPosDiagram() {
  return (
    <DiagramFrame label="Kasetfair POS architecture: a Next.js client with a Zustand store and PromptPay QR talks to Supabase auth, Postgres with row-level security, and realtime">
      <Flow cols="minmax(0,1fr) 28px minmax(0,1.2fr)">
        <Stack>
          <Node title="Next.js client" sub="TypeScript · checkout · dashboard" tone="focus" />
          <Node title="Zustand store" sub="Cart · session" />
          <Node title="PromptPay QR" sub="Payload from sale amount" />
        </Stack>
        <Arrow both />
        <Stack>
          <Node title="Supabase Auth" sub="Vendor accounts" />
          <Node title="Postgres + RLS" sub="Products · inventory · sales, scoped per vendor" />
          <Node
            title="Realtime"
            sub={
              <>
                Inventory updates <Ph>[VERIFY]</Ph>
              </>
            }
            tone="unverified"
          />
        </Stack>
      </Flow>
    </DiagramFrame>
  );
}

const LAYERS = [
  { name: "UI", detail: "Widgets, screens" },
  { name: "Presentation", detail: "BLoC / Cubit" },
  { name: "Domain", detail: "Entities, use cases, repository interfaces" },
  { name: "Data", detail: "Repositories, Firebase / API sources" },
];

/** Generic Clean Architecture layers. Self-drawn; shows no ttb product detail. */
export function CleanArchitectureDiagram() {
  return (
    <DiagramFrame
      label="Clean Architecture layers, top to bottom: UI, Presentation, Domain, Data"
      caption="Clean Architecture — call flow top to bottom. Domain has no Flutter or Firebase imports."
    >
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {LAYERS.map((l, i) => (
          <li key={l.name} className="flex flex-col gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-center font-mono text-sm leading-none font-medium text-muted">
                ↓
              </span>
            )}
            <div
              className={
                "flex items-center justify-between gap-4 rounded-lg border bg-raise px-4 py-3.5 " +
                (i === LAYERS.length - 1 ? "border-ink" : "border-line")
              }
            >
              <span className="font-mono text-[13px] leading-[1.4] font-medium">{l.name}</span>
              <span className="text-right text-[13px] text-muted">{l.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </DiagramFrame>
  );
}

function Steps({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div>
      <div className="label mb-2.5 text-[11px]">{title}</div>
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="font-mono text-[13px] leading-none font-medium text-muted">
                →
              </span>
            )}
            <span className="rounded-lg border border-line bg-raise px-3 py-2 font-mono text-xs leading-[1.4] font-medium whitespace-nowrap">
              {s}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Generic merge pipeline and release lanes. Self-drawn; shows no ttb product detail. */
export function CiPipelineDiagram() {
  return (
    <DiagramFrame
      label="CI: merge pipeline and Fastlane plus Melos release lanes"
      caption="CI — every change starts from a spec and passes tests and review before Jenkins builds it."
    >
      <div className="flex flex-col gap-5">
        <Steps title="Merge pipeline" steps={["Jira spec", "Unit test + lint", "Merge request", "Code review", "Jenkins"]} />
        <div className="border-t border-line pt-[18px]">
          <Steps
            title="Fastlane + Melos lanes"
            steps={["analyze", "unit test", "version bump", "deploy → App Distribution"]}
          />
        </div>
      </div>
    </DiagramFrame>
  );
}
