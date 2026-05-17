'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'soped_mun_application_draft'

export default function InscripcionPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    country: '',
    committee: '',
    motivation: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [emailTouched, setEmailTouched] = useState(false)

  // Load draft
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setForm(JSON.parse(saved))
      } catch {}
    }
  }, [])

  // Autosave + timestamp (Google Forms-like)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    setLastSaved(new Date())
  }, [form])

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const emailValid = emailRegex.test(form.email)
  const isValid =
    form.name.trim() &&
    emailValid &&
    form.phone.trim() &&
    form.institution.trim() &&
    form.country.trim() &&
    form.committee.trim() &&
    form.motivation.trim()

  const submit = async () => {
    if (!isValid) return

    setLoading(true)

    const { error } = await supabase.from('mun_applications').insert([
      {
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        institution: form.institution,
        country: form.country,
        committee: form.committee,
        motivation: form.motivation,
      },
    ])

    setLoading(false)

    if (error) {
      alert('Error al enviar la postulación')
      return
    }

    localStorage.removeItem(STORAGE_KEY)
    setSuccess(true)
  }

  const formatSaved = () => {
    if (!lastSaved) return ''
    return `Guardado • ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.success}>
          <div style={styles.successTitle}>Tu respuesta ha sido registrada</div>
          <div style={styles.successText}>
            SoPeD MUN revisará tu postulación.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.title}>SoPeD MUN</div>
          <div style={styles.subtitle}>Formulario de postulación</div>
          <div style={styles.saved}>{formatSaved()}</div>
        </div>

        {/* FORM */}
        <div style={styles.card}>

          {/* NAME */}
          <div style={styles.field}>
            <label style={styles.label}>Nombre completo *</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              style={styles.input}
            />
          </div>

          {/* EMAIL */}
          <div style={styles.field}>
            <label style={styles.label}>Correo electrónico *</label>
            <input
              value={form.email}
              onChange={(e) => {
                setEmailTouched(true)
                update('email', e.target.value)
              }}
              style={{
                ...styles.input,
                borderColor: !emailValid && emailTouched ? '#d93025' : '#dadce0',
              }}
            />
            {!emailValid && emailTouched && (
              <div style={styles.error}>Ingresa un correo válido</div>
            )}
          </div>

          {/* PHONE */}
          <div style={styles.field}>
            <label style={styles.label}>Número de teléfono *</label>
            <input
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              style={styles.input}
            />
          </div>

          {/* INSTITUTION */}
          <div style={styles.field}>
            <label style={styles.label}>Institución educativa *</label>
            <input
              value={form.institution}
              onChange={(e) => update('institution', e.target.value)}
              style={styles.input}
            />
          </div>

          {/* COUNTRY */}
          <div style={styles.field}>
            <label style={styles.label}>País *</label>
            <input
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              style={styles.input}
            />
          </div>

          {/* COMMITTEE */}
          <div style={styles.field}>
            <label style={styles.label}>Comité de interés *</label>
            <input
              value={form.committee}
              onChange={(e) => update('committee', e.target.value)}
              style={styles.input}
            />
          </div>

          {/* MOTIVATION */}
          <div style={styles.field}>
            <label style={styles.label}>Motivación *</label>
            <textarea
              value={form.motivation}
              onChange={(e) => update('motivation', e.target.value)}
              style={styles.textarea}
            />
          </div>

          <button
            onClick={submit}
            disabled={!isValid || loading}
            style={{
              ...styles.button,
              opacity: !isValid || loading ? 0.5 : 1,
              cursor: !isValid || loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Enviando...' : 'Enviar formulario'}
          </button>

        </div>

      </div>
    </div>
  )
}

const styles: any = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    display: 'flex',
    justifyContent: 'center',
    padding: 24,
    fontFamily: 'Arial, sans-serif',
    color: '#202124',
  },

  container: {
    width: '100%',
    maxWidth: 720,
  },

  header: {
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: 600,
  },

  subtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 4,
  },

  saved: {
    fontSize: 11,
    color: '#5f6368',
  },

  card: {
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 10,
    padding: 20,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    color: '#202124',
    marginBottom: 6,
  },

  input: {
    width: '100%',
    padding: 10,
    border: '1px solid #dadce0',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    transition: '0.15s',
  },

  textarea: {
    width: '100%',
    minHeight: 120,
    padding: 10,
    border: '1px solid #dadce0',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    resize: 'none',
  },

  error: {
    marginTop: 6,
    fontSize: 11,
    color: '#d93025',
  },

  button: {
    marginTop: 10,
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    padding: 12,
    borderRadius: 6,
    fontWeight: 600,
    width: '100%',
  },

  success: {
    marginTop: 120,
    textAlign: 'center',
  },

  successTitle: {
    fontSize: 20,
    marginBottom: 8,
  },

  successText: {
    fontSize: 13,
    opacity: 0.6,
  },
}