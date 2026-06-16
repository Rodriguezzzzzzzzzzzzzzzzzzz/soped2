'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth'
import { validateEmail } from '@/lib/auth/validators'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')

    const { valid, message } = validateEmail(email)
    if (!valid) {
      setError(message || 'Ingresa un correo válido.')
      return
    }

    setLoading(true)
    const result = await AuthService.sendPasswordReset(email)
    setLoading(false)

    if (result.success) {
      setSent(true)
    } else {
      setError(result.error || 'No se pudo enviar el correo.')
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
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '20%',
            width: '400px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(240,231,213,0.25) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-40px',
            bottom: '5%',
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(200px, 20vw, 320px)',
            fontWeight: 700,
            color: 'rgba(160,16,40,0.09)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          D
        </div>
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
          <p
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.72rem',
              fontWeight: 400,
              color: 'rgba(160,16,40,0.7)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '2rem',
            }}
          />
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
                Recuperar contraseña
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.82rem',
                  color: 'rgba(44,24,16,0.45)',
                  fontWeight: 300,
                }}
              >
                {sent
                  ? 'Revisa tu bandeja de entrada para restablecer tu contraseña'
                  : 'Ingresa tu correo y te enviaremos un enlace de recuperación'}
              </p>
            </div>

            {sent ? (
              <>
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
                    Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
                    Revisa también tu carpeta de spam.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/login')}
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
                  Volver al inicio de sesión
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(44,24,16,0.55)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#FEFCEF',
                      border: '1px solid rgba(160,16,40,0.12)',
                      color: '#2C1810',
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#A01028'
                      e.target.style.boxShadow = '0 0 0 3px rgba(160,16,40,0.12)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(160,16,40,0.12)'
                      e.target.style.boxShadow = 'none'
                    }}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    autoComplete="email"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                  />
                </div>

                {error && (
                  <p
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.78rem',
                      color: 'rgba(200,0,48,0.85)',
                      padding: '0.6rem 0.875rem',
                      background: 'rgba(200,0,48,0.06)',
                      border: '1px solid rgba(200,0,48,0.2)',
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
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
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'background 0.25s ease, opacity 0.25s ease',
                    marginTop: '0.25rem',
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#9A0021' }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#A01028' }}
                >
                  {loading ? 'Enviando…' : 'Enviar enlace de recuperación'}
                </button>

                <button
                  onClick={() => router.push('/login')}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: 'transparent',
                    border: 'none',
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.78rem',
                    color: 'rgba(160,16,40,0.5)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#A01028')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(160,16,40,0.5)')}
                >
                  Volver al inicio de sesión
                </button>
              </div>
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
