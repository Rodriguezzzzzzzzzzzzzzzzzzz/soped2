'use client'

import { useState } from 'react'

export default function MunForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    institucion: '',
    experiencia: '',
    motivacion: '',
    comite: '',
    disponibilidad: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        className="glass"
        style={{
          padding: '3rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✦</div>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', color: '#d4af37' }}>
          Solicitud enviada
        </h3>
        <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', lineHeight: 1.7 }}>
          Tu solicitud de participación en SoPeD MUN ha sido recibida. Nos comunicaremos contigo a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <div className="glass" style={{ padding: '2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(184,150,12,0.7)',
          }}
        >
          Formulario de inscripción
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2rem',
            fontWeight: 500,
            color: '#fff',
            marginTop: '0.5rem',
          }}
        >
          SoPeD MUN
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label-glass">Nombre completo *</label>
          <input
            type="text"
            className="input-glass"
            placeholder="Tu nombre completo"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
          />
        </div>

        <div>
          <label className="label-glass">Institución educativa *</label>
          <input
            type="text"
            className="input-glass"
            placeholder="Nombre de tu colegio o universidad"
            value={formData.institucion}
            onChange={(e) => handleChange('institucion', e.target.value)}
          />
        </div>

        <div>
          <label className="label-glass">Experiencia en debate</label>
          <select
            className="input-glass"
            value={formData.experiencia}
            onChange={(e) => handleChange('experiencia', e.target.value)}
            style={{ appearance: 'none', cursor: 'pointer' }}
          >
            <option value="" style={{ background: '#091c36' }}>Selecciona tu nivel</option>
            <option value="ninguna" style={{ background: '#091c36' }}>Sin experiencia previa</option>
            <option value="basica" style={{ background: '#091c36' }}>Básica (1–2 torneos)</option>
            <option value="intermedia" style={{ background: '#091c36' }}>Intermedia (3–6 torneos)</option>
            <option value="avanzada" style={{ background: '#091c36' }}>Avanzada (7+ torneos)</option>
          </select>
        </div>

        <div>
          <label className="label-glass">Selección de comité *</label>
          <select
            className="input-glass"
            value={formData.comite}
            onChange={(e) => handleChange('comite', e.target.value)}
            style={{ appearance: 'none', cursor: 'pointer' }}
          >
            <option value="" style={{ background: '#091c36' }}>Selecciona un comité</option>
            <option value="csnu" style={{ background: '#091c36' }}>Consejo de Seguridad de la ONU</option>
            <option value="agonu" style={{ background: '#091c36' }}>Asamblea General de la ONU</option>
            <option value="ecosoc" style={{ background: '#091c36' }}>ECOSOC</option>
            <option value="unhrc" style={{ background: '#091c36' }}>Consejo de DDHH (UNHRC)</option>
            <option value="crisis" style={{ background: '#091c36' }}>Comité de Crisis</option>
          </select>
        </div>

        <div>
          <label className="label-glass">Carta de motivación *</label>
          <textarea
            className="input-glass"
            placeholder="Explica por qué deseas participar en SoPeD MUN y qué esperas lograr..."
            value={formData.motivacion}
            onChange={(e) => handleChange('motivacion', e.target.value)}
            style={{ minHeight: '120px', resize: 'vertical' }}
          />
        </div>

        <div>
          <label className="label-glass">Disponibilidad</label>
          <input
            type="text"
            className="input-glass"
            placeholder="Ej: Fines de semana, julio 2025"
            value={formData.disponibilidad}
            onChange={(e) => handleChange('disponibilidad', e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit} style={{ marginTop: '0.5rem' }}>
          Enviar solicitud MUN
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
