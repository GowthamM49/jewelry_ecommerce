import React from 'react'

export default function Input({
  label,
  helper,
  error,
  className = '',
  inputClassName = '',
  id,
  ...props
}) {
  const inputId = id || props.name
  const describedBy = error ? `${inputId}-error` : helper ? `${inputId}-help` : undefined

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`input-field ${error ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-100' : ''} ${inputClassName}`}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="help-text text-red-600">
          {error}
        </p>
      ) : helper ? (
        <p id={`${inputId}-help`} className="help-text">
          {helper}
        </p>
      ) : null}
    </div>
  )
}

