'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Programas', href: '/programas' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'MUN', href: '/mun' },
  { label: 'Debate Escolar', href: '/debate-escolar' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(9, 28, 54, 0.92)'
            : 'rgba(9, 28, 54, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <Image
              src="/public-logosoped.svg"
              alt="SoPeD Logo"
              width={45}
              height={45}
              style={{ objectFit: 'contain' }}
            />
            <div className="flex flex-col leading-none">
              <span
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '0.05em',
                }}
              >
                SoPeD
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.6rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Soc. Peruana de Debate
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="btn-text">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
              Ingresar
            </Link>
            <Link href="/inscripcion" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
              Inscribirse
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Abrir menú"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: menuOpen ? 'rgba(184,150,12,0.8)' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s ease',
                transform: menuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: menuOpen ? 'rgba(184,150,12,0.8)' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s ease',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: menuOpen ? 'rgba(184,150,12,0.8)' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s ease',
                transform: menuOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{
            background: 'rgba(9,28,54,0.97)',
            backdropFilter: 'blur(20px)',
            paddingTop: '80px',
          }}
        >
          <div className="flex flex-col items-center gap-8 pt-12">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '2rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  animationDelay: `${i * 80}ms`,
                }}
                className="animate-fade-up"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-4 mt-8 w-48">
              <Link href="/login" className="btn-secondary" onClick={closeMenu} style={{ justifyContent: 'center' }}>
                Ingresar
              </Link>
              <Link href="/inscripcion" className="btn-primary" onClick={closeMenu} style={{ justifyContent: 'center' }}>
                Inscribirse
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
