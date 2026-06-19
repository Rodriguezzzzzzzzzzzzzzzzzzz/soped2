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
        <div className="mi-inner">
          <div className="mi-header">
            <div className="mi-back">
              <BackButton href="/membresia">Volver a membresías</BackButton>
            </div>
            <div className="mi-header-content">
              <div className="mi-eyebrow">
                <span className="mi-eyebrow-line" />
                Membresía Individual
              </div>
              <h1 className="mi-title">Solicita tu <em>Membresía</em></h1>
              <p className="mi-desc">
                Completa el formulario y da el primer paso hacia una membresía
                que te abrirá las puertas a programas académicos, competencias
                internacionales y una red de líderes del debate en todo el Perú.
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
      </div>

      <style jsx>{`
        .mi-page {
          min-height: calc(100vh - ${navbarH}px);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem 4rem;
          transition: opacity 0.5s ease;
        }

        .mi-inner {
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .mi-header {
          width: 100%;
        }

        .mi-back {
          margin-bottom: 1.5rem;
        }

        .mi-header-content {
          padding: 0 0.25rem;
        }

        .mi-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-family: var(--font-outfit);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }
        .mi-eyebrow-line {
          display: block;
          width: 1.5rem;
          height: 1px;
          background: var(--institutional);
          flex-shrink: 0;
        }

        .mi-title {
          font-family: var(--font-cormorant);
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin-bottom: 0.5rem;
        }
        .mi-title em {
          font-style: italic;
          color: var(--institutional);
        }

        .mi-desc {
          font-family: var(--font-outfit);
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.75;
          max-width: 540px;
        }

        .mi-form-wrap {
          width: 100%;
          background: var(--bg-elevated);
          border-radius: 12px;
          border: 1px solid rgba(160,16,40,0.15);
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        }

        .mi-frame {
          width: 100%;
          min-height: 72vh;
          border: none;
          display: block;
        }

        @media (max-width: 480px) {
          .mi-page {
            padding: 1.25rem 0.75rem 3rem;
          }
          .mi-frame {
            min-height: 82vh;
          }
        }
      `}</style>
    </>
  )
}
