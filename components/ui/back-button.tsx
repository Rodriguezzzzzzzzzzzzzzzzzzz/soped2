'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

type BackButtonProps = {
  href?: string
  onClick?: () => void
  children?: ReactNode
  label?: string
}

export function BackButton({ href, onClick, children, label }: BackButtonProps) {
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
    <button onClick={onClick} type="button" className="bb">
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
  font-family: var(--font-outfit), system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 520;
  letter-spacing: -0.01em;
  color: rgba(0, 0, 0, 0.55);
  text-decoration: none;
  padding: 0.45rem 0.9rem 0.45rem 0.45rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 7px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  user-select: none;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease;
}
.bb:focus-visible {
  border-color: rgba(124, 1, 26, 0.25);
  box-shadow: 0 0 0 3px rgba(124, 1, 26, 0.15);
}
.bb:hover {
  color: rgba(124, 1, 26, 0.85);
  border-color: rgba(124, 1, 26, 0.12);
  box-shadow:
    0 2px 8px rgba(124, 1, 26, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.03);
  transform: translateY(-1px);
}
.bb:active {
  transform: scale(0.97) translateY(0);
  border-color: rgba(124, 1, 26, 0.18);
  box-shadow: 0 1px 3px rgba(124, 1, 26, 0.04);
  transition-duration: 0.05s;
}
.bb-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 5px;
  background: rgba(124, 1, 26, 0.06);
  color: rgba(124, 1, 26, 0.45);
  flex-shrink: 0;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bb-icon svg {
  width: 13px;
  height: 13px;
  display: block;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bb:hover .bb-icon {
  background: rgba(124, 1, 26, 0.10);
  color: rgba(124, 1, 26, 0.7);
  transform: scale(1.06);
}
.bb:hover .bb-icon svg {
  transform: translateX(-2px);
}
.bb:active .bb-icon {
  transform: scale(0.94);
}
.bb:active .bb-icon svg {
  transform: translateX(-1px);
}
.bb-text {
  transition: color 0.2s ease;
}
`
