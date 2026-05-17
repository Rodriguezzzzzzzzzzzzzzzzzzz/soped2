'use client'

import Layout from '@/components/layout/Layout'
import { useState, useEffect } from 'react'
import { munService } from '@/src/mun/services/munService'
import { onSnapshot, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRolesStore } from '@/src/mun/roles.store'

export default function MunDashboardPage() {
  const [view, setView] = useState<'delegaciones' | 'comites' | 'sesiones'>('delegaciones')
  const [delegaciones, setDelegaciones] = useState<any[]>([])
  const [comites, setComites] = useState<any[]>([])
  const [sesiones, setSesiones] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState({ delegaciones: false, comites: false, sesiones: false })

  const { currentUser, canManageSystem, canControlCommittee } = useRolesStore()

  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubDelegaciones = onSnapshot(collection(db, 'delegates'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      setDelegaciones(data)
      setLoaded(prev => ({ ...prev, delegaciones: true }))
    }, () => setError('Error cargando delegaciones'))

    const unsubComites = onSnapshot(collection(db, 'committees'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      setComites(data)
      setLoaded(prev => ({ ...prev, comites: true }))
    }, () => setError('Error cargando comités'))

    const unsubSesiones = onSnapshot(collection(db, 'mun_sessions'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      setSesiones(data)
      setLoaded(prev => ({ ...prev, sesiones: true }))
    }, () => setError('Error cargando sesiones'))

    return () => {
      unsubDelegaciones()
      unsubComites()
      unsubSesiones()
    }
  }, [])

  useEffect(() => {
    const allLoaded = loaded.delegaciones && loaded.comites && loaded.sesiones
    if (allLoaded) {
      setLoading(false)
    }
  }, [loaded])

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '3rem', color: '#fff' }}>
          <h2>Cargando sistema MUN...</h2>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div style={{ padding: '3rem', color: 'red' }}>
          <h2>{error}</h2>
        </div>
      </Layout>
    )
  }

  const btnStyle = {
    padding: '1rem',
    border: '1px solid #333',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '10px'
  }

  const getBtnStyle = (v: string) => ({
    ...btnStyle,
    background: view === v ? '#222' : 'transparent',
    borderColor: view === v ? '#555' : '#333'
  })

  return (
    <Layout>
      <div style={{
        padding: '3rem',
        color: '#fff',
        minHeight: '100vh',
        overflowY: 'auto'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          SoPeD MUN Dashboard
        </h1>

        <p style={{ opacity: 0.6 }}>
          Sistema de gestión MUN activo. Aquí se conectará el motor de Claude.
        </p>

        <div style={{
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          <button style={getBtnStyle('delegaciones')} onClick={() => setView('delegaciones')}>
            Delegaciones
          </button>

          <button style={getBtnStyle('comites')} onClick={() => setView('comites')} disabled={!canControlCommittee()}>
            Comités
          </button>

          <button style={getBtnStyle('sesiones')} onClick={() => setView('sesiones')}>
            Sesiones
          </button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #222', borderRadius: '10px' }}>
          {view === 'delegaciones' && (
            <div>
              <h2>Delegaciones</h2>
              {delegaciones.map((d) => (
                <div key={d.id}>
                  {d.country} - {d.status}
                </div>
              ))}
            </div>
          )}

          {view === 'comites' && (
            <div>
              <h2>Comités</h2>
              {comites.map((c) => (
                <div key={c.id}>{c.name}</div>
              ))}
            </div>
          )}

          {view === 'sesiones' && (
            <div>
              <h2>Sesiones</h2>
              {sesiones.map((s) => (
                <div key={s.id}>
                  {s.name} - {s.status}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}