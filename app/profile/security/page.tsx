'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthService } from '@/lib/auth'
import type { VerificationStatus } from '@/lib/auth/types'

export default function SecurityPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; emailVerified: boolean } | null>(null)
  const [status, setStatus] = useState<VerificationStatus>('pending')
  const [loading, setLoading] = useState(true)
  const [verifySent, setVerifySent] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setLoading(false)
      if (!u) {
        router.push('/login')
        return
      }
      setUser({ email: u.email || '', emailVerified: u.emailVerified })
      setStatus(u.emailVerified ? 'verified' : 'pending')
    })
    return () => unsub()
  }, [router])

  const handleResendVerification = async () => {
    if (!auth.currentUser) return
    await sendEmailVerification(auth.currentUser)
    setVerifySent(true)
    setTimeout(() => setVerifySent(false), 5000)
  }

  const handleLogout = async () => {
    await AuthService.logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
        <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.88rem', color: 'rgba(44,24,16,0.4)' }}>Cargando…</p>
      </div>
    )
  }

  if (!user) return null

  const statusColor = status === 'verified' ? 'rgba(56,142,60,0.85)' : status === 'suspended' ? 'rgba(200,0,48,0.85)' : 'rgba(245,124,0,0.85)'
  const statusBg = status === 'verified' ? 'rgba(56,142,60,0.06)' : status === 'suspended' ? 'rgba(200,0,48,0.06)' : 'rgba(245,124,0,0.06)'
  const statusBorder = status === 'verified' ? 'rgba(56,142,60,0.2)' : status === 'suspended' ? 'rgba(200,0,48,0.2)' : 'rgba(245,124,0,0.2)'
  const statusLabel = status === 'verified' ? 'Verificada' : status === 'suspended' ? 'Suspendida' : status === 'locked' ? 'Bloqueada' : 'Pendiente de verificación'

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'transparent',
      }}
    >
      {/* ─── Brand panel ─── */}
      <div
        style={{
          flex: '0 0 42%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4rem 3rem',
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(160deg, #A01028 0%, #B01030 15%, #F0E7D5 45%, #FEFCEF 80%, #FEFCEF 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-5%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(160,16,40,0.30) 0%, transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(160,16,40,0.18) 0%, transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 380 }}>
          <img
            src="/soped.svg"
            alt="SoPeD"
            style={{ width: 100, height: 100, objectFit: 'contain', display: 'block', margin: '0 auto 1.5rem' }}
          />
          <h1
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)',
              fontWeight: 600,
              color: '#2C1810',
              letterSpacing: '0.02em',
              marginBottom: '0.4rem',
            }}
          >
            Seguridad de la cuenta
          </h1>
          <div style={{ width: 50, height: 2, background: '#A01028', margin: '0 auto 2rem' }} />
          <p
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.9rem',
              color: 'rgba(44,24,16,0.55)',
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Gestiona la seguridad de tu cuenta, sesiones activas y métodos de verificación.
          </p>
        </div>
      </div>

      {/* ─── Content panel ─── */}
      <div
        style={{
          flex: '0 0 58%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4rem 3rem',
          background: '#FEFCEF',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* ─── Account info ─── */}
          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(160,16,40,0.10)',
              padding: '2rem',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#A01028' }} />
            <h2
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.3rem',
                fontWeight: 600,
                color: '#2C1810',
                marginBottom: '1rem',
              }}
            >
              Información de la cuenta
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(44,24,16,0.4)',
                    marginBottom: '0.15rem',
                  }}
                >
                  Correo electrónico
                </p>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.88rem', color: '#2C1810' }}>
                  {user.email}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(44,24,16,0.4)',
                    marginBottom: '0.15rem',
                  }}
                >
                  Estado de verificación
                </p>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.25rem 0.6rem',
                    background: statusBg,
                    border: `1px solid ${statusBorder}`,
                    borderRadius: 4,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: statusColor }}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
            {status === 'pending' && (
              <button
                onClick={handleResendVerification}
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  padding: '0.65rem 1rem',
                  background: 'transparent',
                  border: '1px solid rgba(160,16,40,0.15)',
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.75rem',
                  color: 'rgba(160,16,40,0.6)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#A01028'
                  e.currentTarget.style.borderColor = 'rgba(160,16,40,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(160,16,40,0.6)'
                  e.currentTarget.style.borderColor = 'rgba(160,16,40,0.15)'
                }}
              >
                {verifySent ? '✓ Correo enviado' : 'Reenviar verificación'}
              </button>
            )}
          </div>

          {/* ─── OAuth section ─── */}
          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(160,16,40,0.10)',
              padding: '2rem',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#A01028' }} />
            <h2
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.3rem',
                fontWeight: 600,
                color: '#2C1810',
                marginBottom: '0.75rem',
              }}
            >
              Conexiones
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.78rem',
                color: 'rgba(44,24,16,0.45)',
                marginBottom: '1rem',
                lineHeight: 1.6,
              }}
            >
              Conecta tu cuenta con servicios externos para iniciar sesión de forma rápida y segura.
            </p>
            {['Google', 'GitHub', 'Microsoft', 'LinkedIn'].map((provider) => (
              <div
                key={provider}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid rgba(160,16,40,0.06)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(44,24,16,0.5)' }}>
                  {provider}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.65rem',
                    color: 'rgba(44,24,16,0.25)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Próximamente
                </span>
              </div>
            ))}
          </div>

          {/* ─── Logout ─── */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: '#A01028',
              color: '#fff',
              border: 'none',
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.82rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.25s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#9A0021')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#A01028')}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
