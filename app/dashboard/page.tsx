'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, ensureUserProfile, getUserProfile } from '@/lib/firebase'
import Navbar from '@/components/layout/Navbar'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import EventsPanel from '@/components/dashboard/EventsPanel'
import CertificatesPanel from '@/components/dashboard/CertificatesPanel'
import MaterialsPanel from '@/components/dashboard/MaterialsPanel'
import Link from 'next/link'

function OverviewPanel({ user }: { user: any }) {
  const overviewStats = [
    { label: 'Eventos inscritos', value: '0' },
    { label: 'Certificados', value: '0' },
    { label: 'Materiales', value: '0' },
    { label: 'Estado', value: 'Nuevo usuario' },
  ]
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
          {user.displayName}
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
          <Link href="/eventos" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
            Explorar eventos →
          </Link>
          <Link href="/mun/chair" className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
            Crear comité MUN →
          </Link>
        </div>
      </div>

      {/* Notifications placeholder */}
      <div className="glass" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '1rem', opacity: 0.5 }}>🔔</span>
        <div>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
            Tu cuenta fue creada correctamente y ya está conectada a Firebase.
          </p>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.2rem' }}>
            Próximamente podrás crear y administrar MUNs globales.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState('overview')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      try {
        if (u) {
          await ensureUserProfile(u)

          const profile = await getUserProfile(u.uid)

          setUser({
            uid: u.uid,
            email: u.email || '',
            displayName: profile?.name || 'Usuario',
            role: profile?.role || 'user',
          })
        } else {
          setUser(null)
          router.push('/login')
        }
      } catch (err) {
        console.error(err)
        setUser(null)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          color: 'white',
          fontFamily: 'var(--font-outfit)',
        }}
      >
        Cargando plataforma SoPeD MUN...
      </div>
    )
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          color: 'white',
          fontFamily: 'var(--font-outfit)',
        }}
      >
        Redirigiendo...
      </div>
    )
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':
        return <OverviewPanel user={user} />
      case 'events':
        return <EventsPanel />
      case 'certificates':
        return <CertificatesPanel />
      case 'materials':
        return <MaterialsPanel />
      default:
        return <OverviewPanel user={user} />
    }
  }

  return (
    <>
      <Navbar />
      <DashboardLayout
        activePanel={activePanel}
        onNavigate={setActivePanel}
        user={user}
      >
        {renderPanel()}
      </DashboardLayout>
    </>
  )
}
