'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { ensureUserProfile } from '@/lib/user'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos.')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isRegisterMode) {
        const result = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )

        console.log('Usuario registrado:', result.user)
        await ensureUserProfile(result.user)
      } else {
        const result = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )

        console.log('Login exitoso:', result.user)
        await ensureUserProfile(result.user)
      }

      router.push('/dashboard')
    } catch (err: any) {
      const message = err?.message || ''

      if (message.includes('auth/email-already-in-use')) {
        setError('Este correo ya está registrado.')
      } else if (message.includes('auth/invalid-credential')) {
        setError('Correo o contraseña incorrectos.')
      } else if (message.includes('auth/weak-password')) {
        setError('La contraseña es demasiado débil.')
      } else {
        setError('Ocurrió un error durante la autenticación.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#FEFCEF',
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
            'linear-gradient(160deg, #7C011A 0%, #B01030 15%, #F0E7D5 45%, #FEFCEF 80%, #FEFCEF 100%)',
        }}
      >
        {/* Red atmospheric glow — stronger */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-5%',
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle, rgba(124,1,26,0.30) 0%, transparent 65%)',
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
            background:
              'radial-gradient(circle, rgba(124,1,26,0.18) 0%, transparent 65%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        {/* Cream glow from top to balance */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '20%',
            width: '400px',
            height: '300px',
            background:
              'radial-gradient(circle, rgba(240,231,213,0.25) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        {/* Large decorative "D" */}
        <div
          style={{
            position: 'absolute',
            left: '-40px',
            bottom: '5%',
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(200px, 20vw, 320px)',
            fontWeight: 700,
            color: 'rgba(124,1,26,0.09)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          D
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 380 }}>
          {/* Logo */}
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
              color: 'rgba(124,1,26,0.7)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '2rem',
            }}
          >
          </p>

          {/* Red divider */}
          <div
            style={{
              width: 50,
              height: 2,
              background: '#7C011A',
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
          {/* Card */}
          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(124,1,26,0.10)',
              padding: '2.5rem 2.5rem 2rem',
              position: 'relative',
            }}
          >
            {/* Red top accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: '#7C011A',
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
                {isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión'}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.82rem',
                  color: 'rgba(44,24,16,0.45)',
                  fontWeight: 300,
                }}
              >
                {isRegisterMode
                  ? 'Crea una cuenta para ingresar a la plataforma MUN'
                  : 'Accede a tu cuenta institucional SoPeD'}
              </p>
            </div>

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
                    border: '1px solid rgba(124,1,26,0.12)',
                    color: '#2C1810',
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7C011A'
                    e.target.style.boxShadow = '0 0 0 3px rgba(124,1,26,0.12)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(124,1,26,0.12)'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <label
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(44,24,16,0.55)',
                    }}
                  >
                    Contraseña
                  </label>
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.7rem',
                      color: 'rgba(124,1,26,0.5)',
                      padding: 0,
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'rgba(124,1,26,0.8)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(124,1,26,0.5)')
                    }
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input
                  type="password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#FEFCEF',
                    border: '1px solid rgba(124,1,26,0.12)',
                    color: '#2C1810',
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7C011A'
                    e.target.style.boxShadow = '0 0 0 3px rgba(124,1,26,0.12)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(124,1,26,0.12)'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.78rem',
                    color: 'rgba(165,0,30,0.85)',
                    padding: '0.6rem 0.875rem',
                    background: 'rgba(165,0,30,0.06)',
                    border: '1px solid rgba(165,0,30,0.2)',
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
                  background: '#7C011A',
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
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = '#9A0021'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = '#7C011A'
                }}
              >
                {loading
                  ? 'Verificando acceso…'
                  : isRegisterMode
                  ? 'Crear cuenta'
                  : 'Ingresar a la plataforma'}
              </button>
            </div>
          </div>

          {/* Toggle */}
          <p
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.82rem',
              color: 'rgba(44,24,16,0.4)',
              textAlign: 'center',
              marginTop: '1.5rem',
            }}
          >
            {isRegisterMode ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}

            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode)
                setError('')
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.82rem',
                color: '#7C011A',
                padding: 0,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = '#9A0021')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = '#7C011A')
              }
            >
              {isRegisterMode ? 'Inicia sesión' : 'Crear cuenta'}
            </button>
          </p>

          {/* Institutional footer */}
          <p
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.68rem',
              color: 'rgba(124,1,26,0.35)',
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
