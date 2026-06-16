'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Programas', href: '/programas' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'MUN', href: '/mun' },
  { label: 'Debate', href: '/debate-escolar' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const sectionIds = navLinks
      .map((l) => l.href.replace('/', ''))
      .filter(Boolean)

    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id)
            }
          })
        },
        { threshold: 0.6 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-500"
        style={{
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(200,30,50,0.12)',
          boxShadow: 'var(--shadow-md)',
          transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 group" onClick={closeMenu}>
            <Image
              src="/soped.svg"
              alt="SoPeD Logo"
              width={52}
              height={52}
              style={{ objectFit: 'contain' }}
            />
            <div className="flex flex-col leading-tight">
              <span
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  color: 'var(--ivory)',
                  letterSpacing: '0.04em',
                  lineHeight: 1.2,
                }}
              >
                SoPeD
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.65rem',
                  fontWeight: 400,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  lineHeight: 1.3,
                }}
              >
                Sociedad Peruana de Debate
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const id = link.href.replace('/', '')
              const isActive = pathname === link.href || activeSection === id

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="btn-text"
                  style={{
                    color: isActive ? 'var(--ivory)' : 'var(--text-secondary)',
                    borderBottom: isActive ? '1px solid var(--ivory)' : '1px solid transparent',
                    paddingBottom: '3px',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
              Ingresar
            </Link>
            <Link href="/membresia" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
              Ser miembro
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col items-center justify-center gap-1.5"
            aria-label="Abrir menú"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', flexShrink: 0 }}
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: menuOpen ? 'var(--ivory)' : 'var(--text-secondary)',
                transition: 'all 0.3s ease',
                transform: menuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: menuOpen ? 'var(--ivory)' : 'var(--text-secondary)',
                transition: 'all 0.3s ease',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: menuOpen ? 'var(--ivory)' : 'var(--text-secondary)',
                transition: 'all 0.3s ease',
                transform: menuOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className="soped-mobile-menu"
        data-open={menuOpen}
        onClick={(e) => { if (e.target === e.currentTarget) closeMenu() }}
      >
        <div className="soped-mobile-menu__panel">
          {/* Close button */}
          <button
            onClick={closeMenu}
            className="soped-mobile-menu__close"
            aria-label="Cerrar menú"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <nav className="soped-mobile-menu__nav">
            {navLinks.map((link, i) => {
              const id = link.href.replace('/', '')
              const isActive = pathname === link.href || activeSection === id

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`soped-mobile-menu__link ${isActive ? 'soped-mobile-menu__link--active' : ''}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="soped-mobile-menu__link-text">{link.label}</span>
                  <span className="soped-mobile-menu__link-indicator" />
                </Link>
              )
            })}
          </nav>

          <div className="soped-mobile-menu__divider" />

          <div className="soped-mobile-menu__cta">
            <Link href="/login" className="soped-btn soped-btn--ghost soped-mobile-menu__btn" onClick={closeMenu}>
              Ingresar
            </Link>
            <Link href="/membresia" className="soped-btn soped-btn--primary soped-mobile-menu__btn" onClick={closeMenu}>
              Ser miembro
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
