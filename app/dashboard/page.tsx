'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import EventsPanel from '@/components/dashboard/EventsPanel'
import CertificatesPanel from '@/components/dashboard/CertificatesPanel'
import MaterialsPanel from '@/components/dashboard/MaterialsPanel'
import Link from 'next/link'

const mockUser = {
  name: 'Alejandro Herrera',
  email: 'alejandro@soped.pe',
  role: 'Delegado MUN',
}

const overviewStats = [
  { label: 'Eventos inscritos', value: '3' },
  { label: 'Certificados', value: '2' },
  { label: 'Materiales', value: '4' },
  { label: 'Estado MUN', value: 'Activo' },
]

function OverviewPanel({ user }: { user: typeof mockUser }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(184,150,12,0.6)',
            marginBottom: '0.5rem',
          }}
        >
          Bienvenido de vuelta
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2.8rem',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.1,
          }}
        >
          {user.name}
        </h1>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {overviewStats.map((s) => (
          <div
            key={s.label}
            className="glass"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '2.5rem',
                fontWeight: 600,
                color: '#d4af37',
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* MUN Status Card */}
      <div
        className="glass"
        style={{
          padding: '2rem',
          borderLeft: '2px solid rgba(184,150,12,0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(184,150,12,0.65)',
                marginBottom: '0.5rem',
              }}
            >
              Estado de participación MUN
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.6rem',
                fontWeight: 500,
                color: '#fff',
                marginBottom: '0.4rem',
              }}
            >
              SoPeD MUN 2025
            </h3>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
              Comité: Consejo de Seguridad de la ONU · País asignado: Canadá
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
            <span
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.3rem 0.8rem',
                border: '1px solid rgba(34,197,94,0.35)',
                color: 'rgba(34,197,94,0.85)',
                background: 'rgba(34,197,94,0.06)',
              }}
            >
              Confirmado
            </span>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
              Julio 18–20, 2025
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
              Preparación del delegado
            </span>
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.7rem', color: 'rgba(184,150,12,0.7)' }}>
              65%
            </span>
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: '65%',
                background: 'linear-gradient(90deg, #b8960c, #d4af37)',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
            marginBottom: '1rem',
          }}
        >
          Acciones rápidas
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/inscripcion" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
            Inscribirse a evento →
          </Link>
          <Link href="/eventos" className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
            Ver calendario
          </Link>
        </div>
      </div>

      {/* Notifications placeholder */}
      <div className="glass" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '1rem', opacity: 0.5 }}>🔔</span>
        <div>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
            El sistema de notificaciones estará disponible próximamente.
          </p>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.2rem' }}>
            Función en desarrollo — v2.0
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState('overview')

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':
        return <OverviewPanel user={mockUser} />
      case 'events':
        return <EventsPanel />
      case 'certificates':
        return <CertificatesPanel />
      case 'materials':
        return <MaterialsPanel />
      default:
        return <OverviewPanel user={mockUser} />
    }
  }

  return (
    <>
      <Navbar />
      <DashboardLayout
        activePanel={activePanel}
        onNavigate={setActivePanel}
        user={mockUser}
      >
        {renderPanel()}
      </DashboardLayout>
    </>
  )
}
