import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  children,
  hover,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`gradient-card rounded-3xl shadow-xl shadow-brand-900/5 border border-white/60 ${paddings[padding]} ${hover ? 'transition-all duration-300 hover:shadow-2xl hover:shadow-brand-600/10 hover:-translate-y-1 cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
