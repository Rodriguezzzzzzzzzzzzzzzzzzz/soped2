'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

type BackButtonProps = {
  href?: string
  onClick?: () => void
  children?: ReactNode
  label?: string
  disabled?: boolean
}

export function BackButton({ href, onClick, children, label, disabled }: BackButtonProps) {
  const text = children ?? label

  const icon = (
    <span className="bb-icon" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M10 12.5 5.5 8 10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="bb">
        {icon}
        <span className="bb-text">{text}</span>
        <style jsx>{bbStyles}</style>
      </Link>
    )
  }

  return (
    <button onClick={onClick} type="button" className="bb" disabled={disabled}>
      {icon}
      <span className="bb-text">{text}</span>
      <style jsx>{bbStyles}</style>
    </button>
  )
}

const bbStyles = `
.bb {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.5rem 1rem;
  font-family: var(--font-outfit), system-ui, sans-serif;
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 229, 214, 0.62);
  text-decoration: none;
  white-space: nowrap;
  background: rgba(236, 229, 214, 0.035);
  border: 1px solid rgba(236, 229, 214, 0.16);
  border-radius: 2px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  user-select: none;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.25s ease,
    transform 0.15s ease;
}
.bb:hover {
  color: rgba(236, 229, 214, 0.92);
  background: rgba(236, 229, 214, 0.07);
  border-color: rgba(236, 229, 214, 0.32);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transform: translateY(-1px);
}
.bb:active {
  transform: scale(0.97) translateY(0);
  transition-duration: 0.05s;
}
.bb:focus-visible {
  outline: 2px solid rgba(236, 229, 214, 0.55);
  outline-offset: 3px;
}
.bb:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.bb-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgba(236, 229, 214, 0.5);
  transition: color 0.2s ease;
}
.bb-icon svg {
  width: 13px;
  height: 13px;
  display: block;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bb:hover .bb-icon {
  color: rgba(236, 229, 214, 0.9);
}
.bb:hover .bb-icon svg {
  transform: translateX(-2px);
}
.bb-text {
  transition: color 0.2s ease;
}
`
