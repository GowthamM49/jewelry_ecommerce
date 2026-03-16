import React from 'react'

const base =
  'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:ring-4 focus-visible:ring-gold-200 disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary:
    'bg-gold-500 hover:bg-gold-600 text-white shadow-sm hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
  danger:
    'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0',
}

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-2.5 px-6 text-sm',
  lg: 'py-3.5 px-8 text-lg',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) {
  const isDisabled = disabled || loading
  return (
    <Comp
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={Comp === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled ? true : undefined}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          <span>{children}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {leftIcon ? <span aria-hidden="true">{leftIcon}</span> : null}
          <span>{children}</span>
          {rightIcon ? <span aria-hidden="true">{rightIcon}</span> : null}
        </span>
      )}
    </Comp>
  )
}

