'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import CertificateForm from '@/components/certificados/CertificateForm'
import CertificateResult from '@/components/certificados/CertificateResult'
import CertificateNotFound from '@/components/certificados/CertificateNotFound'
import { findCertificateByCode } from '@/data/certificates'
import type { Certificate } from '@/data/certificates'

type ViewState =
  | { stage: 'idle' }
  | { stage: 'loading' }
  | { stage: 'found'; certificate: Certificate }
  | { stage: 'not_found' }

export default function CertificateSearchClient() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<ViewState>({ stage: 'idle' })

  const search = useCallback((code: string) => {
    setView({ stage: 'loading' })
    const result = findCertificateByCode(code)
    if (result) {
      setView({ stage: 'found', certificate: result })
    } else {
      setView({ stage: 'not_found' })
    }
  }, [])

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) search(code)
  }, [searchParams, search])

  return (
    <Layout>
      <div
        style={{
          paddingTop: '140px',
          paddingBottom: '6rem',
          minHeight: '100vh',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <span className="deco-line" style={{ width: 30 }} />
              <span
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(236,229,214,0.7)',
                }}
              >
                SoPeD — Certificados
              </span>
              <span className="deco-line" style={{ width: 30 }} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                fontWeight: 400,
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '0.75rem',
              }}
            >
              Verificar certificado
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.92rem',
                color: 'rgba(255,255,255,0.4)',
                maxWidth: 480,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              Ingrese el código único del certificado para verificar su autenticidad.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <CertificateForm onSearch={search} loading={view.stage === 'loading'} />
          </div>

          {view.stage === 'found' && (
            <CertificateResult certificate={view.certificate} />
          )}
          {view.stage === 'not_found' && <CertificateNotFound />}
        </div>
      </div>
    </Layout>
  )
}
