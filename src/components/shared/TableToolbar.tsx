import { Search, Pencil, Trash2 } from 'lucide-react'

interface TableToolbarProps {
  search: string
  onSearch: (value: string) => void
  selectedCount: number
  onBulkDelete: () => void
}

/** Search box + filter dropdown + edit/delete actions above a data table. */
export function TableToolbar({
  search,
  onSearch,
  selectedCount,
  onBulkDelete,
}: TableToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="h-11 w-64 rounded-lg border border-line bg-white pl-3.5 pr-9 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-muted">Filter</label>
          <select className="h-11 rounded-lg border border-line bg-white px-3 text-sm focus:border-brand focus:outline-none">
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={selectedCount === 0}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-brand hover:bg-surface disabled:opacity-40"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          disabled={selectedCount === 0}
          onClick={onBulkDelete}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-brand hover:bg-surface disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
