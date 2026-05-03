'use client'

import { useState } from 'react'

export default function DebateForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    grado: '',
    colegio: '',
    nivel: '',
    interes: '',
    autorizacion: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="glass" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>✦</div>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', color: '#d4af37' }}>
          ¡Inscripción recibida!
        </h3>
        <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', lineHeight: 1.7 }}>
          Tu inscripción al programa de Debate Escolar ha sido registrada. Te contactaremos pronto.
        </p>
      </div>
    )
  }

  return (
    <div className="glass" style={{ padding: '2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
          Formulario de inscripción
        </span>
        <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 500, color: '#fff', marginTop: '0.5rem' }}>
          Debate Escolar
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label-glass">Nombre completo *</label>
          <input type="text" className="input-glass" placeholder="Tu nombre completo" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label-glass">Grado escolar *</label>
            <select className="input-glass" value={formData.grado} onChange={(e) => handleChange('grado', e.target.value)} style={{ appearance: 'none', cursor: 'pointer' }}>
              <option value="" style={{ background: '#091c36' }}>Selecciona</option>
              {['1ro Secundaria', '2do Secundaria', '3ro Secundaria', '4to Secundaria', '5to Secundaria'].map((g) => (
                <option key={g} value={g} style={{ background: '#091c36' }}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-glass">Nivel de experiencia</label>
            <select className="input-glass" value={formData.nivel} onChange={(e) => handleChange('nivel', e.target.value)} style={{ appearance: 'none', cursor: 'pointer' }}>
              <option value="" style={{ background: '#091c36' }}>Selecciona</option>
              <option value="ninguno" style={{ background: '#091c36' }}>Sin experiencia</option>
              <option value="basico" style={{ background: '#091c36' }}>Básico</option>
              <option value="intermedio" style={{ background: '#091c36' }}>Intermedio</option>
              <option value="avanzado" style={{ background: '#091c36' }}>Avanzado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label-glass">Colegio *</label>
          <input type="text" className="input-glass" placeholder="Nombre de tu institución" value={formData.colegio} onChange={(e) => handleChange('colegio', e.target.value)} />
        </div>

        <div>
          <label className="label-glass">¿Por qué te interesa el debate? *</label>
          <textarea className="input-glass" placeholder="Cuéntanos tus motivaciones..." value={formData.interes} onChange={(e) => handleChange('interes', e.target.value)} style={{ minHeight: '100px', resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <input
            type="checkbox"
            id="autorizacion"
            checked={formData.autorizacion}
            onChange={(e) => handleChange('autorizacion', e.target.checked)}
            style={{ marginTop: '2px', accentColor: '#b8960c', width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="autorizacion" style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, cursor: 'pointer' }}>
            Autorización del padre/madre/tutor. Al ser menor de edad, confirmo que cuento con autorización de mis padres o tutor legal para participar en este programa.
          </label>
        </div>

        <button className="btn-primary" onClick={() => setSubmitted(true)} style={{ marginTop: '0.5rem' }}>
          Enviar inscripción
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
