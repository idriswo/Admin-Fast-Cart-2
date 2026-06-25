import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  pageCount: number
  total: number
  onChange: (page: number) => void
}

export function Pagination({ page, pageCount, total, onChange }: PaginationProps) {
  if (pageCount <= 1) {
    return (
      <div className="flex justify-end pt-4 text-sm text-muted">
        {total} Results
      </div>
    )
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 2
  )

  return (
    <div className="flex items-center justify-between pt-4">
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) => {
          const prev = pages[i - 1]
          return (
            <span key={p} className="flex items-center">
              {prev && p - prev > 1 && (
                <span className="px-1 text-muted">...</span>
              )}
              <button
                onClick={() => onChange(p)}
                className={cn(
                  'h-8 min-w-8 rounded-md px-2 text-sm',
                  p === page
                    ? 'bg-blue-50 font-medium text-brand'
                    : 'text-ink hover:bg-surface'
                )}
              >
                {p}
              </button>
            </span>
          )
        })}
        <button
          disabled={page === pageCount}
          onClick={() => onChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface disabled:opacity-40"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <span className="text-sm text-muted">{total} Results</span>
    </div>
  )
}
