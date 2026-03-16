import React from 'react'

export default function Card({ className = '', hover = false, children, ...props }) {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }) {
  return <div className={`px-6 sm:px-8 pt-6 sm:pt-8 ${className}`}>{children}</div>
}

export function CardBody({ className = '', children }) {
  return <div className={`px-6 sm:px-8 pb-6 sm:pb-8 ${className}`}>{children}</div>
}

