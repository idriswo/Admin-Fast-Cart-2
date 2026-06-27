import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-lg border border-line bg-card px-3.5 text-sm text-ink placeholder:text-muted',
        'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
