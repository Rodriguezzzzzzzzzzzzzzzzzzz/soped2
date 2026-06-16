'use client'

import { useEffect, useState } from 'react'
import { BackButton } from '@/components/ui/back-button'

export default function MembresiaIndividualPage() {
  const [navbarH, setNavbarH] = useState(64)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nav = document.querySelector('nav, header') as HTMLElement | null
    if (nav) setNavbarH(nav.offsetHeight)
    else setNavbarH(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 64)
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <>
      <div className="mi-page" style={{ opacity: visible ? 1 : 0 }}>
        <div className="mi-header">
          <div style={{ marginBottom: '1.5rem' }}>
            <BackButton href="/membresia">Volver a membresías</BackButton>
          </div>
          <div className="mi-header-content">
            <div className="mi-eyebrow">
              <span className="mi-eyebrow-line" />
              Membresía Individual
            </div>
            <h1 className="mi-title">Solicita tu <em>Membresía</em></h1>
            <p className="mi-desc">
              Da el primer paso para formar parte de la comunidad académica más
              activa del debate peruano. Completa tus datos y nuestro equipo se
              pondrá en contacto contigo para guiarte en el proceso de afiliación.
            </p>
          </div>
        </div>

        <div className="mi-form-wrap">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSciQeOoVyV5ZjQOrD9csuFivHU_6jrbou2NiTKJNIUbcVbDuw/viewform?embedded=true"
            className="mi-frame"
            title="Formulario de Solicitud de Membresía Individual"
          >
            Cargando…
          </iframe>
        </div>
      </div>

      <style jsx>{`
        .mi-page {
          min-height: calc(100vh - ${navbarH}px);
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem 3rem;
          transition: opacity 0.5s ease;
        }

        .mi-header {
          width: 100%;
          max-width: 760px;
          margin-bottom: 1.5rem;
        }

        .mi-header-content {
          padding: 0 0.25rem;
        }

        .mi-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-family: var(--font-outfit), system-ui, sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          margin-bottom: 0.75rem;
        }
        .mi-eyebrow-line {
          display: block;
          width: 1.5rem;
          height: 1px;
          background: rgba(0,0,0,0.2);
          flex-shrink: 0;
        }

        .mi-title {
          font-family: var(--font-cormorant), Georgia, serif;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 500;
          color: rgba(0,0,0,0.85);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin-bottom: 0.5rem;
        }
        .mi-title em {
          font-style: italic;
          color: #A01028;
        }

        .mi-desc {
          font-family: var(--font-outfit), system-ui, sans-serif;
          font-size: 0.88rem;
          color: rgba(0,0,0,0.5);
          line-height: 1.75;
          max-width: 500px;
        }

        .mi-form-wrap {
          width: 100%;
          max-width: 760px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          overflow: hidden;
        }

        .mi-frame {
          width: 100%;
          min-height: 75vh;
          border: none;
          display: block;
        }

        @media (max-width: 480px) {
          .mi-page {
            padding: 1.25rem 0.75rem 2rem;
          }
          .mi-frame {
            min-height: 85vh;
          }
        }
      `}</style>
    </>
  )
}
