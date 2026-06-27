import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useToastStore, type ToastType } from '@/store/toast'
import { cn } from '@/lib/utils'

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-success" />,
  error: <XCircle className="h-5 w-5 text-danger" />,
  info: <Info className="h-5 w-5 text-brand" />,
}

/** Renders the global toast queue (fixed, top-right). */
export function Toaster() {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-start gap-3 rounded-lg border bg-card p-3.5 shadow-md',
            t.type === 'success' && 'border-success/30',
            t.type === 'error' && 'border-danger/30',
            t.type === 'info' && 'border-brand/30'
          )}
        >
          {icons[t.type]}
          <p className="flex-1 text-sm text-ink">{t.message}</p>
          <button onClick={() => remove(t.id)} className="text-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
