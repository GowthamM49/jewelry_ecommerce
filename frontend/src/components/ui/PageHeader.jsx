import React from 'react'

export default function PageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <div className="mb-10">
      {eyebrow ? <p className="page-subtitle mb-2">{eyebrow}</p> : null}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="page-title mb-3">{title}</h1>
          <div className="w-24 h-1 bg-gold-500" />
          {subtitle ? <p className="text-gray-600 mt-4 max-w-2xl">{subtitle}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </div>
  )
}

