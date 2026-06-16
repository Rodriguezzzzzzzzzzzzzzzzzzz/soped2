'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthService } from '@/lib/auth'
import { validateEmail, validatePassword, getPasswordErrorMessage } from '@/lib/auth/validators'
import type { AuthMode, PasswordStrength } from '@/lib/auth/types'

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: '#FEFCEF',
  border: '1px solid rgba(160,16,40,0.12)',
  color: '#2C1810',
  fontFamily: 'var(--font-outfit)',
  fontSize: '0.88rem',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
}

const INPUT_FOCUS_STYLE = '0 0 0 3px rgba(160,16,40,0.12)'

function PasswordStrengthBar({ strength }: { strength: PasswordStrength }) {
  if (strength.score === 0) return null
  return (
    <div style={{ marginTop: '0.4rem' }}>
      <div
        style={{
          height: 3,
          background: 'rgba(160,16,40,0.08)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(strength.score / 4) * 100}%`,
            background: strength.color,
            borderRadius: 2,
            transition: 'width 0.3s ease, background 0.3s ease',
          }}
        />
      </div>
      <p
        style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '0.65rem',
          color: strength.color,
          marginTop: '0.25rem',
          fontWeight: 400,
          transition: 'color 0.3s ease',
        }}
      >
        {strength.label}
      </p>
    </div>
  )
}

function PasswordRequirements({ checks }: { checks: PasswordStrength['checks'] }) {
  const items = [
    { key: 'length' as const, label: '8+ caracteres' },
    { key: 'uppercase' as const, label: 'Mayúscula' },
    { key: 'lowercase' as const, label: 'Minúscula' },
    { key: 'number' as const, label: 'Número' },
    { key: 'special' as const, label: 'Carácter especial' },
  ]
  return (
    <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem 0.75rem' }}>
      {items.map(({ key, label }) => (
        <span
          key={key}
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.6rem',
            color: checks[key] ? 'rgba(56,142,60,0.7)' : 'rgba(44,24,16,0.3)',
            transition: 'color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
          }}
        >
          <span style={{ fontSize: '0.55rem' }}>{checks[key] ? '✓' : '○'}</span>
          {label}
        </span>
      ))}
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<AuthMode>('login')
  const [rememberMe, setRememberMe] = useState(true)
  const [emailError, setEmailError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [redirecting, setRedirecting] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const emailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified && !redirecting) {
        setRedirecting(true)
        router.push('/dashboard')
      }
    })
    return () => unsub()
  }, [router, redirecting])

  const debouncedEmailCheck = useCallback((value: string) => {
    if (emailTimerRef.current) clearTimeout(emailTimerRef.current)
    emailTimerRef.current = setTimeout(async () => {
      const { valid } = validateEmail(value)
      if (!valid) {
        setEmailError(validateEmail(value).message || '')
        return
      }
      if (mode === 'register') {
        const { isDuplicate } = await AuthService.checkDuplicateEmail(value)
        setEmailError(isDuplicate ? 'Este correo ya está registrado.' : '')
      }
    }, 400)
  }, [mode])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
    setNeedsVerification(false)

    if (field === 'email') {
      setEmailError('')
      if (value.length > 3) debouncedEmailCheck(value)
    }
    if (field === 'password' && mode === 'register') {
      const { strength } = validatePassword(value)
      setPasswordStrength(strength)
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    if (field === 'email') {
      const value = formData.email
      if (value.length > 0) {
        const { valid, message } = validateEmail(value)
        if (!valid) setEmailError(message || 'Correo inválido.')
      }
    }
  }

  const handleSubmit = async () => {
    setError('')
    setNeedsVerification(false)

    if (!formData.email || !formData.password) {
      setError('Completa todos los campos.')
      return
    }

    const { valid: emailValid, message: emailMsg } = validateEmail(formData.email)
    if (!emailValid) {
      setError(emailMsg || 'Correo inválido.')
      return
    }

    if ((formData.password).length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'register') {
        const result = await AuthService.register(formData.email, formData.password)
        if (result.success) {
          if (result.needsEmailVerification) {
            setNeedsVerification(true)
            setVerificationEmail(formData.email)
            await AuthService.sendVerificationEmail()
          } else {
            router.push('/dashboard')
          }
        } else {
          setError(result.error || 'Error al crear la cuenta.')
        }
      } else {
        const result = await AuthService.login(formData.email, formData.password, rememberMe)
        if (result.success) {
          if (result.needsEmailVerification) {
            setNeedsVerification(true)
            setVerificationEmail(formData.email)
          } else {
            setRedirecting(true)
            router.push('/dashboard')
          }
        } else {
          setError(result.error || 'Credenciales inválidas.')
        }
      }
    } catch {
      setError('Ocurrió un error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) handleSubmit()
  }

  const resetMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login'
    setMode(newMode)
    setError('')
    setEmailError('')
    setPasswordStrength(null)
    setTouched({ email: false, password: false })
    setNeedsVerification(false)
    setShowPassword(false)
  }

  const handleResendVerification = async () => {
    setLoading(true)
    await AuthService.sendVerificationEmail()
    setLoading(false)
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

            {needsVerification ? (
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
                    Te enviamos un enlace de verificación a <strong style={{ color: '#A01028' }}>{verificationEmail}</strong>
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
                <button
                  onClick={handleResendVerification}
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
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#9A0021' }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#A01028' }}
                >
                  {loading ? 'Enviando…' : 'Reenviar verificación'}
                </button>
                <button
                  onClick={() => {
                    setNeedsVerification(false)
                    setMode('login')
                    setFormData({ email: '', password: '' })
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    marginTop: '0.75rem',
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
                    {mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: '0.82rem',
                      color: 'rgba(44,24,16,0.45)',
                      fontWeight: 300,
                    }}
                  >
                    {mode === 'register'
                      ? 'Crea una cuenta para ingresar a la plataforma MUN'
                      : 'Accede a tu cuenta institucional SoPeD'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onKeyDown={handleKeyDown}>
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
                        ...INPUT_STYLE,
                        borderColor: touched.email && emailError ? 'rgba(200,0,48,0.5)' : 'rgba(160,16,40,0.12)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#A01028'
                        e.target.style.boxShadow = INPUT_FOCUS_STYLE
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = touched.email && emailError ? 'rgba(200,0,48,0.5)' : 'rgba(160,16,40,0.12)'
                        e.target.style.boxShadow = 'none'
                        handleBlur('email')
                      }}
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      autoComplete="email"
                    />
                    {touched.email && emailError && (
                      <p
                        style={{
                          fontFamily: 'var(--font-outfit)',
                          fontSize: '0.65rem',
                          color: 'rgba(200,0,48,0.7)',
                          marginTop: '0.25rem',
                        }}
                      >
                        {emailError}
                      </p>
                    )}
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
                      {mode === 'login' && (
                        <button
                          onClick={() => router.push('/forgot-password')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-outfit)',
                            fontSize: '0.7rem',
                            color: 'rgba(160,16,40,0.5)',
                            padding: 0,
                            textDecoration: 'none',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(160,16,40,0.8)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(160,16,40,0.5)')}
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        style={{
                          ...INPUT_STYLE,
                          paddingRight: '2.5rem',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#A01028'
                          e.target.style.boxShadow = INPUT_FOCUS_STYLE
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(160,16,40,0.12)'
                          e.target.style.boxShadow = 'none'
                        }}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-outfit)',
                          fontSize: '0.65rem',
                          color: 'rgba(44,24,16,0.3)',
                          padding: '0.25rem',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(160,16,40,0.5)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(44,24,16,0.3)')}
                      >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                    {mode === 'register' && passwordStrength && touched.password && (
                      <>
                        <PasswordStrengthBar strength={passwordStrength} />
                        <PasswordRequirements checks={passwordStrength.checks} />
                      </>
                    )}
                  </div>

                  {mode === 'login' && (
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-outfit)',
                        fontSize: '0.78rem',
                        color: 'rgba(44,24,16,0.45)',
                        fontWeight: 300,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{
                          accentColor: '#A01028',
                          width: 15,
                          height: 15,
                          cursor: 'pointer',
                        }}
                      />
                      Recordar mi sesión
                    </label>
                  )}

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
                    {loading
                      ? 'Verificando acceso…'
                      : mode === 'register'
                      ? 'Crear cuenta'
                      : 'Ingresar a la plataforma'}
                  </button>
                </div>
              </>
            )}
          </div>

          {!needsVerification && (
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.82rem',
                color: 'rgba(44,24,16,0.4)',
                textAlign: 'center',
                marginTop: '1.5rem',
              }}
            >
              {mode === 'register' ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
              <button
                onClick={resetMode}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.82rem',
                  color: '#A01028',
                  padding: 0,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#9A0021')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A01028')}
              >
                {mode === 'register' ? 'Inicia sesión' : 'Crear cuenta'}
              </button>
            </p>
          )}

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
