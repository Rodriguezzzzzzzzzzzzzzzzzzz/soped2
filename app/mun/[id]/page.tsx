'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'

type Role = 'director' | 'adjunto' | 'delegado'

export default function MUNPage() {
  const { id } = useParams()
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [event, setEvent] = useState<any>(null)
  const [role, setRole] = useState<Role>('delegado')

  const [sessionStep, setSessionStep] = useState<
    'setup' | 'rollcall' | 'debate' | 'voting' | 'final'
  >('setup')

  const [rankingVisible, setRankingVisible] = useState(false)

  // 🔐 AUTH CHECK
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/login')
        return
      }

      setUser(u)
    })

    if (!id) return
    const ref = doc(db, 'events', String(id))

    const unsubEvent = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setEvent(snap.data())
      }
      setLoading(false)
    })

    return () => {
      unsubAuth()
      unsubEvent()
    }
  }, [id, router])

  // 👮 ROLE SIMULATION (TEMPORAL)
  useEffect(() => {
    if (user?.email?.includes('director')) {
      setRole('director')
    } else {
      setRole('delegado')
    }
  }, [user?.email])

  if (loading) return <div style={{ padding: 40 }}>Cargando MUN...</div>

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/* LEFT PANEL */}
      <div style={{ flex: 1, padding: 30 }}>

        <h1>🏛️ MUN EVENT</h1>
        <h2>{event?.name || 'Evento sin nombre'}</h2>

        <p>Usuario: {user?.email}</p>
        <p>Rol: {role}</p>

        {/* SESSION CONTROL */}
        <div style={{ marginTop: 20 }}>
          <h3>Estado de sesión</h3>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setSessionStep('rollcall')}>Roll Call</button>
            <button onClick={() => setSessionStep('debate')}>Debate</button>
            <button onClick={() => setSessionStep('voting')}>Votación</button>
            <button onClick={() => setSessionStep('final')}>Final</button>
          </div>
        </div>

        {/* ROLE RESTRICTIONS */}
        <div style={{ marginTop: 30 }}>
          <h3>Panel según rol</h3>

          {role === 'director' && (
            <div style={{ color: 'green' }}>
              ✔ Acceso total: puedes pausar sesión, ver ranking y publicar resultados
            </div>
          )}

          {role === 'adjunto' && (
            <div style={{ color: 'orange' }}>
              ⚙ Puedes operar sesiones pero no publicar ranking
            </div>
          )}

          {role === 'delegado' && (
            <div style={{ color: 'gray' }}>
              👤 Solo participación y mociones
            </div>
          )}
        </div>

        {/* RANKING CONTROL */}
        <div style={{ marginTop: 30 }}>
          <h3>Ranking</h3>

          {!rankingVisible && role !== 'director' && (
            <p>🔒 Ranking oculto hasta final del evento</p>
          )}

          {role === 'director' && (
            <button onClick={() => setRankingVisible(!rankingVisible)}>
              {rankingVisible ? 'Ocultar ranking' : 'Publicar ranking'}
            </button>
          )}

          {rankingVisible && (
            <div>
              <p>🥇 Perú - 95 pts</p>
              <p>🥈 USA - 88 pts</p>
              <p>🥉 Francia - 80 pts</p>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: 300,
        background: '#0f172a',
        color: 'white',
        padding: 20
      }}>
        <h3>LIVE PANEL</h3>

        <p>Sesión: {sessionStep}</p>

        {sessionStep === 'debate' && (
          <div style={{ color: '#22c55e' }}>
            🟢 Debate activo
          </div>
        )}

        {sessionStep === 'voting' && (
          <div style={{ color: '#f59e0b' }}>
            🟡 Votación en curso
          </div>
        )}

        {sessionStep === 'final' && (
          <div style={{ color: '#ef4444' }}>
            🔴 Sesión finalizada
          </div>
        )}
      </div>

    </div>
  )
}