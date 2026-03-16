import React from 'react'
import Button from './Button'

export default function EmptyState({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className="text-center py-12">
      {icon ? (
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mb-4">
          {icon}
        </div>
      ) : null}
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {description ? <p className="text-gray-600 mb-6">{description}</p> : null}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {primaryAction ? (
          <Button as={primaryAction.as || 'button'} {...primaryAction.props}>
            {primaryAction.label}
          </Button>
        ) : null}
        {secondaryAction ? (
          <Button
            as={secondaryAction.as || 'button'}
            variant="secondary"
            {...secondaryAction.props}
          >
            {secondaryAction.label}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

