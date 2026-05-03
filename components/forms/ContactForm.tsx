'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="glass" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>✦</div>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#d4af37' }}>Mensaje enviado</h3>
        <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
          Gracias por contactarnos. Responderemos tu mensaje a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <div className="glass" style={{ padding: '2.5rem' }}>
      <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 500, color: '#fff', marginBottom: '1.5rem' }}>
        Envíanos un mensaje
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label className="label-glass">Nombre</label>
          <input type="text" className="input-glass" placeholder="Tu nombre" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
        </div>
        <div>
          <label className="label-glass">Correo electrónico</label>
          <input type="email" className="input-glass" placeholder="tu@email.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
        </div>
        <div>
          <label className="label-glass">Mensaje</label>
          <textarea className="input-glass" placeholder="¿En qué podemos ayudarte?" value={formData.mensaje} onChange={(e) => handleChange('mensaje', e.target.value)} style={{ minHeight: '120px', resize: 'vertical' }} />
        </div>
        <button className="btn-primary" onClick={() => setSubmitted(true)}>
          Enviar mensaje →
        </button>
      </div>
    </div>
  )
}
