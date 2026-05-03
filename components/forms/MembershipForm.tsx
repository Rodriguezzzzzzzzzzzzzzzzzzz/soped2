'use client'

import { useState } from 'react'

const skills = ['Oratoria', 'Liderazgo', 'Investigación', 'Escritura', 'Organización', 'Idiomas']

export default function MembershipForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    motivacion: '',
    habilidades: [] as string[],
    experiencia: '',
    disponibilidad: '',
    razon: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      habilidades: prev.habilidades.includes(skill)
        ? prev.habilidades.filter((s) => s !== skill)
        : [...prev.habilidades, skill],
    }))
  }

  if (submitted) {
    return (
      <div className="glass" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>✦</div>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', color: '#d4af37' }}>Solicitud de membresía enviada</h3>
        <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', lineHeight: 1.7 }}>
          Tu solicitud para unirte a SoPeD ha sido recibida. El equipo revisará tu perfil y te contactará pronto.
        </p>
      </div>
    )
  }

  return (
    <div className="glass" style={{ padding: '2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
          Membresía institucional
        </span>
        <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 500, color: '#fff', marginTop: '0.5rem' }}>
          Únete a SoPeD
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label-glass">Nombre completo *</label>
          <input type="text" className="input-glass" placeholder="Tu nombre completo" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
        </div>

        <div>
          <label className="label-glass">Motivación personal *</label>
          <textarea className="input-glass" placeholder="¿Qué te motiva a unirte a la Sociedad Peruana de Debate?" value={formData.motivacion} onChange={(e) => handleChange('motivacion', e.target.value)} style={{ minHeight: '100px', resize: 'vertical' }} />
        </div>

        <div>
          <label className="label-glass">Habilidades destacadas</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
            {skills.map((skill) => {
              const active = formData.habilidades.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.75rem',
                    padding: '0.4rem 1rem',
                    border: active ? '1px solid rgba(184,150,12,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    background: active ? 'rgba(184,150,12,0.12)' : 'rgba(255,255,255,0.03)',
                    color: active ? '#d4af37' : 'rgba(255,255,255,0.45)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    letterSpacing: '0.05em',
                  }}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="label-glass">Experiencia previa en debate / MUN</label>
          <textarea className="input-glass" placeholder="Describe brevemente tu experiencia..." value={formData.experiencia} onChange={(e) => handleChange('experiencia', e.target.value)} style={{ minHeight: '80px', resize: 'vertical' }} />
        </div>

        <div>
          <label className="label-glass">Disponibilidad horaria</label>
          <input type="text" className="input-glass" placeholder="Ej: tardes de lunes a viernes, fines de semana" value={formData.disponibilidad} onChange={(e) => handleChange('disponibilidad', e.target.value)} />
        </div>

        <div>
          <label className="label-glass">¿Por qué deberías ser parte de SoPeD? *</label>
          <textarea className="input-glass" placeholder="Cuéntanos qué valor puedes aportar a la sociedad..." value={formData.razon} onChange={(e) => handleChange('razon', e.target.value)} style={{ minHeight: '100px', resize: 'vertical' }} />
        </div>

        <button className="btn-primary" onClick={() => setSubmitted(true)} style={{ marginTop: '0.5rem' }}>
          Solicitar membresía
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
