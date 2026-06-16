'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthService } from '@/lib/auth'

type VerifyState = 'checking' | 'verified' | 'pending' | 'error'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [state, setState] = useState<VerifyState>('checking')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login')
        return
      }
      setEmail(user.email || '')
      if (user.emailVerified) {
        setState('verified')
      } else {
        setState('pending')
      }
    })
    return () => unsub()
  }, [router])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const handleResend = async () => {
    if (cooldown > 0) return
    setMessage('')
    const result = await AuthService.sendVerificationEmail()
    if (result.success) {
      setMessage('Correo de verificación enviado.')
      setCooldown(60)
    } else {
      setMessage(result.error || 'Error al enviar el correo.')
    }
  }

  const handleCheckVerification = async () => {
    setState('checking')
    if (auth.currentUser) {
      await auth.currentUser.reload()
      if (auth.currentUser.emailVerified) {
        setState('verified')
      } else {
        setState('pending')
        setMessage('Aún no verificas tu correo. Revisa tu bandeja de entrada.')
      }
    }
  }

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
            style={{
              width: 100,
              height: 100,
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto 1.5rem',
            }}
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
            Sociedad Peruana de Debate
          </h1>
          <div
            style={{
              width: 50,
              height: 2,
              background: '#A01028',
              margin: '0 auto 2rem',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.9rem',
              color: 'rgba(44,24,16,0.55)',
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Accede a tu espacio académico y continúa tu formación en liderazgo, debate y pensamiento crítico.
          </p>
        </div>
      </div>

      {/* ─── Form panel ─── */}
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
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(160,16,40,0.10)',
              padding: '2.5rem 2.5rem 2rem',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: '#A01028',
              }}
            />

            {state === 'verified' ? (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.6rem',
                      fontWeight: 600,
                      color: '#2C1810',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Correo verificado
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.82rem',
                      color: 'rgba(44,24,16,0.45)',
                      fontWeight: 300,
                    }}
                  >
                    Tu cuenta ha sido verificada correctamente
                  </p>
                </div>
                <div
                  style={{
                    padding: '1rem',
                    background: 'rgba(56,142,60,0.06)',
                    border: '1px solid rgba(56,142,60,0.2)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.78rem',
                      color: 'rgba(56,142,60,0.85)',
                      lineHeight: 1.6,
                    }}
                  >
                    Ya puedes acceder a todas las funcionalidades de la plataforma.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1.5rem',
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
                  Ir al dashboard
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.6rem',
                      fontWeight: 600,
                      color: '#2C1810',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Verifica tu correo
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.82rem',
                      color: 'rgba(44,24,16,0.45)',
                      fontWeight: 300,
                    }}
                  >
                    Hemos enviado un enlace de verificación a <strong style={{ color: '#A01028' }}>{email}</strong>
                  </p>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.78rem',
                    color: 'rgba(44,24,16,0.55)',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                  }}
                >
                  Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                  Si no lo encuentras, revisa la carpeta de spam.
                </p>

                {message && (
                  <p
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.78rem',
                      color: message.includes('enviado') ? 'rgba(56,142,60,0.85)' : 'rgba(200,0,48,0.85)',
                      padding: '0.6rem 0.875rem',
                      background: message.includes('enviado') ? 'rgba(56,142,60,0.06)' : 'rgba(200,0,48,0.06)',
                      border: `1px solid ${message.includes('enviado') ? 'rgba(56,142,60,0.2)' : 'rgba(200,0,48,0.2)'}`,
                      marginBottom: '1rem',
                    }}
                  >
                    {message}
                  </p>
                )}

                <button
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1.5rem',
                    background: '#A01028',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                    opacity: cooldown > 0 ? 0.6 : 1,
                    transition: 'background 0.25s ease, opacity 0.25s ease',
                  }}
                  onMouseEnter={(e) => { if (cooldown <= 0) e.currentTarget.style.background = '#9A0021' }}
                  onMouseLeave={(e) => { if (cooldown <= 0) e.currentTarget.style.background = '#A01028' }}
                >
                  {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar verificación'}
                </button>

                <button
                  onClick={handleCheckVerification}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    marginTop: '0.75rem',
                    background: 'transparent',
                    border: '1px solid rgba(160,16,40,0.15)',
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.78rem',
                    color: 'rgba(160,16,40,0.5)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#A01028'
                    e.currentTarget.style.borderColor = 'rgba(160,16,40,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(160,16,40,0.5)'
                    e.currentTarget.style.borderColor = 'rgba(160,16,40,0.15)'
                  }}
                >
                  Ya verifiqué mi correo
                </button>

                <button
                  onClick={() => router.push('/login')}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    marginTop: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.78rem',
                    color: 'rgba(44,24,16,0.35)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(160,16,40,0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(44,24,16,0.35)')}
                >
                  Volver al inicio de sesión
                </button>
              </>
            )}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.68rem',
              color: 'rgba(160,16,40,0.35)',
              textAlign: 'center',
              marginTop: '2rem',
              letterSpacing: '0.04em',
            }}
          >
            Formando líderes en debate, diplomacia y pensamiento crítico
          </p>
        </div>
      </div>
    </div>
  )
}
