const REGIONS = [
  { key: "us", label: "美國", enabled: true },
  { key: "tw", label: "台灣", enabled: false },
  { key: "jp", label: "日本", enabled: false },
] as const;

/** 地區切換：美國啟用，台灣/日本 disabled（即將推出）。M3 只有美國。 */
export function RegionPills() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {REGIONS.map((r) =>
        r.enabled ? (
          <span
            key={r.key}
            aria-current="true"
            className="rounded-full bg-brand px-3 py-1 text-sm font-medium text-on-brand"
          >
            {r.label}
          </span>
        ) : (
          <span
            key={r.key}
            aria-disabled="true"
            title="即將推出"
            className="cursor-not-allowed rounded-full border border-border-subtle px-3 py-1 text-sm text-text-muted opacity-60"
          >
            {r.label}
            <span className="ml-1 text-xs">即將推出</span>
          </span>
        ),
      )}
    </div>
  );
}
