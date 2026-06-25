import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely (conditional + dedupe). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number as USD currency. */
export function formatPrice(value: number | undefined | null) {
  if (value == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

/** Build an absolute image URL from an API-relative path. */
export function imageUrl(path?: string | null) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = import.meta.env.VITE_API_BASE_URL ?? ''
  return `${base}/images/${path}`
}
