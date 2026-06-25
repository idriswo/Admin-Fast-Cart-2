import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

/** "fastcart" wordmark with a cart glyph (yellow/blue accent like the mockup). */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ShoppingCart className="h-7 w-7 text-amber-400" strokeWidth={2.5} />
      <span className="text-xl font-extrabold italic tracking-tight text-white">
        fastcart
      </span>
    </div>
  )
}
