import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all ${error ? 'border-coral-400 focus:border-coral-400 focus:ring-coral-100' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-coral-500 font-medium">{error}</p>}
    </div>
  )
}
