// Pure-SVG horizontal bar chart — products grouped by category (real data).
interface Bar {
  label: string
  value: number
}

export function CategoryBarChart({ data }: { data: Bar[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-muted">Маълумот нест</p>
  }
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm text-muted">
            {d.label}
          </span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-sm font-medium text-ink">
            {d.value}
          </span>
        </div>
      ))}
    </div>
  )
}
