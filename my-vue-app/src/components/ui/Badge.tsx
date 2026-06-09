import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'purple'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-mint-400/20 text-emerald-700',
  warning: 'bg-sunny-400/20 text-amber-700',
  info: 'bg-brand-100 text-brand-700',
  purple: 'bg-purple-100 text-purple-700',
}

export function Badge({
  children,
  variant = 'default',
}: {
  children: ReactNode
  variant?: BadgeVariant
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
