import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badge = cva(
  'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      tone: {
        success: 'bg-success-bg text-success',
        warning: 'bg-warning/15 text-warning',
        neutral: 'bg-gray-100 text-gray-600',
        info: 'bg-blue-100 text-brand',
        purple: 'bg-slate-200 text-slate-700',
      },
    },
    defaultVariants: { tone: 'neutral' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />
}
