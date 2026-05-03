'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import MunForm from '@/components/forms/MunForm'
import DebateForm from '@/components/forms/DebateForm'
import MembershipForm from '@/components/forms/MembershipForm'
import ContactForm from '@/components/forms/ContactForm'

type FormType = 'mun' | 'debate' | 'membership' | 'contact'

const options: { id: FormType; label: string; desc: string; tag: string }[] = [
  { id: 'mun', label: 'SoPeD MUN', desc: 'Inscripción como delegado al Modelo de Naciones Unidas', tag: 'Internacional' },
  { id: 'debate', label: 'Debate Escolar', desc: 'Inscripción al programa de debate para secundaria', tag: 'Escolar' },
  { id: 'membership', label: 'Membresía SoPeD', desc: 'Solicitud para unirse al equipo interno de SoPeD', tag: 'Institucional' },
  { id: 'contact', label: 'Contacto', desc: 'Enviar un mensaje o consulta general', tag: 'Consulta' },
]

const formMap: Record<FormType, React.ReactNode> = {
  mun: <MunForm />,
  debate: <DebateForm />,
  membership: <MembershipForm />,
  contact: <ContactForm />,
}

export default function InscripcionPage() {
  const [active, setActive] = useState<FormType>('mun')

  return (
    <Layout>
      <section style={{ paddingTop: '140px', paddingBottom: '4rem', background: 'linear-gradient(180deg, #091c36 0%, var(--dark) 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="deco-line" />
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
              Centro de inscripción
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>
            Inscripción & contacto
          </h1>
        </div>
      </section>

      <section style={{ padding: '3rem 0 6rem' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'sticky', top: '100px' }}>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.5rem' }}>
              Tipo de formulario
            </p>
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActive(opt.id)}
                style={{
                  textAlign: 'left',
                  padding: '1.1rem 1.25rem',
                  background: active === opt.id ? 'rgba(184,150,12,0.08)' : 'rgba(255,255,255,0.03)',
                  border: active === opt.id ? '1px solid rgba(184,150,12,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.875rem', fontWeight: 500, color: active === opt.id ? '#d4af37' : '#fff' }}>{opt.label}</span>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.6)' }}>{opt.tag}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{opt.desc}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <div>{formMap[active]}</div>
        </div>
      </section>
    </Layout>
  )
}
