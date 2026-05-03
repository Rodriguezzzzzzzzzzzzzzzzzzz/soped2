'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/dashboard')
    }, 1200)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #05070d 0%, #091c36 50%, #05070d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(9,28,54,0.6) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2.5rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              border: '1px solid rgba(184,150,12,0.45)',
              background: 'rgba(184,150,12,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.8rem',
                fontWeight: 600,
                color: '#d4af37',
                lineHeight: 1,
              }}
            >
              S
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '0.08em',
              }}
            >
              SoPeD
            </p>
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.62rem',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Sociedad Peruana de Debate
            </p>
          </div>
        </Link>

        {/* Card */}
        <div className="glass" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.8rem',
                fontWeight: 500,
                color: '#fff',
                marginBottom: '0.4rem',
              }}
            >
              Iniciar sesión
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              Accede a tu cuenta institucional SoPeD
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label-glass">Correo electrónico</label>
              <input
                type="email"
                className="input-glass"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="label-glass" style={{ margin: 0 }}>Contraseña</label>
                <button
                  className="btn-text"
                  style={{ fontSize: '0.72rem', color: 'rgba(184,150,12,0.6)' }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                type="password"
                className="input-glass"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>

            {error && (
              <p
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.78rem',
                  color: 'rgba(239,68,68,0.8)',
                  padding: '0.6rem 0.875rem',
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                {error}
              </p>
            )}

            <button
              className="btn-primary"
              onClick={handleSubmit}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.25rem',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Verificando...' : 'Ingresar a la plataforma'}
            </button>
          </div>

          {/* Divider */}
          <div className="section-divider" style={{ margin: '1.75rem 0' }} />

          {/* Roles info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.68rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.2)',
                marginBottom: '0.25rem',
              }}
            >
              Roles de acceso
            </p>
            {[
              { role: 'Participante', desc: 'Acceso a eventos y materiales' },
              { role: 'Delegado MUN', desc: 'Panel de delegado y documentos' },
              { role: 'Miembro SoPeD', desc: 'Acceso completo institucional' },
              { role: 'Administrador', desc: 'Gestión completa de la plataforma' },
            ].map((r) => (
              <div key={r.role} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ width: '5px', height: '5px', background: 'rgba(184,150,12,0.3)', borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{r.role}</strong>
                  {' — '}{r.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer link */}
        <p
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.3)',
            textAlign: 'center',
            marginTop: '1.5rem',
          }}
        >
          ¿No tienes cuenta?{' '}
          <Link href="/inscripcion" className="btn-text" style={{ display: 'inline', color: 'rgba(184,150,12,0.7)', fontSize: '0.8rem' }}>
            Inscríbete aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
