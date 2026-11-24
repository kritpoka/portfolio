import { Arrow, DiagramFrame, Flow, Node, Stack } from "./primitives";

export function SmartDormDiagram() {
  return (
    <DiagramFrame
      label="Smart Dorm architecture: Next.js staff and resident dashboards call a Spring Boot back end and one database; a follow-up Flutter app uses the same back end"
      caption="The Flutter student app is a follow-up (2026): Clean Architecture with BLoC, GetIt and Injectable."
    >
      <Flow cols="minmax(0,1.2fr) 28px minmax(0,1fr) 28px minmax(0,0.9fr)">
        <Stack>
          <Node title="Staff + resident web" sub="Next.js dashboards · billing" tone="focus" />
          <Node title="Student app (follow-up)" sub="Flutter · login, room, payment, profile" />
        </Stack>
        <Arrow />
        <Node title="Back end" sub="Spring Boot" />
        <Arrow />
        <Node title="Database" sub="Residents, bills, notices, payment status" />
      </Flow>
    </DiagramFrame>
  );
}

export function KuCampusMapDiagram() {
  return (
    <DiagramFrame
      label="KU Campus Map architecture: build-time scripts produce static data files; a React UI shell talks to a lazily loaded 3D scene through a small map API; hosted statically on Vercel"
      caption="Everything is built ahead of time. The app never calls a map API at runtime."
    >
      <Flow cols="minmax(0,1fr) 28px minmax(0,0.8fr) 28px minmax(0,1.2fr) 28px minmax(0,0.7fr)">
        <Stack>
          <Node title="Build scripts" sub="OSM fetch → trees, fade mask, TopoJSON" />
          <Node title="Shuttle tracer" sub="Python · official route images" />
        </Stack>
        <Arrow />
        <Node title="Static data" sub="One TopoJSON file · places · shuttle lines" />
        <Arrow />
        <Stack>
          <Node title="React UI shell" sub="Search · filters · cards · TH/EN" tone="focus" />
          <Node title="3D scene (lazy)" sub="React Three Fiber · via a small map API" />
        </Stack>
        <Arrow />
        <Node title="Vercel" sub="Static hosting" />
      </Flow>
    </DiagramFrame>
  );
}

export function KasetfairPosDiagram() {
  return (
    <DiagramFrame
      label="Kasetfair POS architecture: a Next.js app with a Zustand cart and in-browser PromptPay QR talks to Supabase Auth and Postgres through the Supabase JS client"
      caption="Row Level Security is on for every table; policies allow only signed-in staff to read or change data."
    >
      <Flow cols="minmax(0,1fr) 28px minmax(0,1.1fr)">
        <Stack>
          <Node title="Next.js app" sub="Client components · deployed on Vercel" tone="focus" />
          <Node title="Zustand store" sub="Cart" />
          <Node title="promptpay-qr" sub="QR for each order's total, in the browser" />
        </Stack>
        <Arrow both />
        <Stack>
          <Node title="Supabase Auth" sub="Fixed staff accounts" />
          <Node title="Postgres + RLS" sub="products · orders · order_items" />
        </Stack>
      </Flow>
    </DiagramFrame>
  );
}

const LAYERS = [
  { name: "UI", detail: "Widgets, screens" },
  { name: "Presentation", detail: "BLoC / Cubit" },
  { name: "Domain", detail: "Entities, use cases" },
  { name: "Data", detail: "Models, remote + local data sources, repositories" },
];

/** Generic Clean Architecture layers. Self-drawn; shows no ttb product detail. */
export function CleanArchitectureDiagram() {
  return (
    <DiagramFrame
      label="Clean Architecture layers, top to bottom: UI, Presentation, Domain, Data"
      caption="Clean Architecture — call flow top to bottom. Remote and local data sources are split so data can be cached."
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

/** A box with a mono title, an optional small uppercase tag and a muted description. */
function FlowBox({ tag, title, detail, focus }: { tag?: string; title: string; detail: string; focus?: boolean }) {
  return (
    <div className={"rounded-lg border bg-raise px-3.5 py-3 " + (focus ? "border-ink" : "border-line")}>
      {tag && (
        <span className="mb-1.5 inline-block font-mono text-[11px] leading-none font-medium tracking-[0.06em] text-muted uppercase">
          {tag}
        </span>
      )}
      <span className="block font-mono text-[13px] leading-[1.4] font-medium">{title}</span>
      <span className="mt-1 block text-[13px] leading-normal text-muted">{detail}</span>
    </div>
  );
}

function DownArrow() {
  return (
    <li aria-hidden="true" className="text-center font-mono text-sm leading-none font-medium text-muted">
      ↓
    </li>
  );
}

/** Smart Locker rental and overtime-payment states. */
export function SmartLockerRentalFlow() {
  const pair = "grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2";
  return (
    <DiagramFrame
      label="Rental flow: start, end on time or over time, then pay overtime within 5 minutes"
      caption="While a payment is pending, the user can't start another rental or end the current one."
    >
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        <li>
          <FlowBox
            title="1 · Start rental"
            detail="Locker available, no pending payment → hours × hourly rate, paid upfront → locker in use"
          />
        </li>
        <DownArrow />
        <li>
          <FlowBox title="2 · End rental" detail="Time used rounded up to the hour" />
        </li>
        <DownArrow />
        <li className={pair}>
          <FlowBox tag="On time" title="Completed" detail="Locker opens and becomes available again" />
          <FlowBox focus tag="Over time" title="Expired + pending payment" detail="Extra hours × overtime rate, PromptPay QR" />
        </li>
        <DownArrow />
        <li className={pair}>
          <FlowBox tag="Paid within 5 min" title="Completed" detail="Total updated, locker opens" />
          <FlowBox tag="After 5 min" title="Payment failed" detail="Marked by checkout or a job every 30 s" />
        </li>
      </ol>
    </DiagramFrame>
  );
}

const LOCKER_LAYERS = [
  { name: "Routes", detail: "Fiber · JWT + role middleware" },
  { name: "Handlers", detail: "Request parsing, presenters for responses" },
  { name: "Services", detail: "Rental, payment and pricing rules", focus: true },
  { name: "Repositories", detail: "SQL with pgx" },
  { name: "PostgreSQL", detail: "Schema from Flyway migrations" },
];

/** Smart Locker backend layers plus the parts beside the services. */
export function SmartLockerDiagram() {
  return (
    <DiagramFrame
      label="Backend layers: routes, handlers, services, repositories, PostgreSQL; plus the locker device client, LINE notifications and scheduled jobs"
      caption="Each layer depends on an interface of the one below, so services are tested without a database. The locker device client, LINE warnings and scheduled jobs are my teammate's."
    >
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {LOCKER_LAYERS.map((l, i) => (
          <li key={l.name} className="flex flex-col gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-center font-mono text-sm leading-none font-medium text-muted">
                ↓
              </span>
            )}
            <div
              className={
                "flex items-center justify-between gap-4 rounded-lg border bg-raise px-3.5 py-3 " +
                (l.focus ? "border-ink" : "border-line")
              }
            >
              <span className="font-mono text-[13px] leading-[1.4] font-medium">{l.name}</span>
              <span className="text-right text-[13px] text-muted">{l.detail}</span>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-[18px] border-t border-line pt-[18px]">
        <div className="label mb-2.5 text-[11px]">Next to the services</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2">
          <FlowBox title="Locker device" detail="Open, close and status over HTTP, by pin" />
          <FlowBox title="LINE notify" detail="Warns the user 5 min before a rental ends" />
          <FlowBox title="Scheduled jobs" detail="Expire unpaid payments · send end-time warnings" />
        </div>
      </div>
    </DiagramFrame>
  );
}
