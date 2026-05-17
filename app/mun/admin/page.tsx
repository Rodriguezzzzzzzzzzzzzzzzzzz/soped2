'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MUNAdmin() {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')

  const fetchData = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('mun_applications')
      .select('*')
      .order('fecha_creacion', { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setData(data || [])
    setLoading(false)
  }

  const confirmPayment = async (id: string) => {
    const { error } = await supabase
      .from('mun_applications')
      .update({ estado: 'pagado' })
      .eq('id', id)

    if (error) return console.error(error)
    fetchData()
  }

  const acceptParticipant = async (id: string) => {
    const { error } = await supabase
      .from('mun_applications')
      .update({ estado: 'aceptado' })
      .eq('id', id)

    if (error) return console.error(error)
    fetchData()
  }

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'pago_pendiente':
        return { background: '#facc15', color: '#000' }
      case 'pagado':
        return { background: '#2563eb', color: '#fff' }
      case 'aceptado':
        return { background: '#16a34a', color: '#fff' }
      default:
        return { background: '#e5e7eb', color: '#000' }
    }
  }

  const exportToCSV = () => {
    if (!data.length) return

    const headers = [
      'nombre_completo',
      'institucion_educativa',
      'tipo_inscripcion',
      'metodo_pago',
      'numero_operacion',
      'estado'
    ]

    const rows = data.map(item =>
      headers.map(h => `"${item[h] ?? ''}"`).join(',')
    )

    const csv = [headers.join(','), ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'mun_postulantes.csv'
    a.click()
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/mun/login')
        return
      }

      // 🔐 ROLE CHECK (ADMIN ONLY)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error(profileError)
        router.push('/mun/login')
        return
      }

      // Only allow admin or chair (future expansion)
      if (profile?.role !== 'admin') {
        router.push('/mun/login')
        return
      }

      fetchData()
    }

    init()
  }, [])

  const filteredData =
    filter === 'todos'
      ? data
      : data.filter((i) => i.estado === filter)

  const total = data.length
  const pendientes = data.filter(i => i.estado === 'pago_pendiente').length
  const pagados = data.filter(i => i.estado === 'pagado').length
  const aceptados = data.filter(i => i.estado === 'aceptado').length

  /* STYLES */
  const cardStyle = {
    padding: '10px 15px',
    borderRadius: '10px',
    background: 'white',
    border: '1px solid #ddd'
  }

  const sideBtn = {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background: '#1e293b',
    color: 'white',
    textAlign: 'left'
  }

  const card = {
    background: 'white',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  }

  const greenBtn = {
    padding: '6px 10px',
    background: '#16a34a',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer'
  }

  const blueBtn = {
    padding: '6px 10px',
    background: '#2563eb',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial' }}>
      {/* SIDEBAR ONU */}
      <div style={{
        width: '260px',
        background: '#0f172a',
        color: 'white',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2 style={{ margin: 0 }}>MUN ONU Panel</h2>
        <p style={{ fontSize: '12px', opacity: 0.7 }}>Navigation</p>

        <button
          onClick={() => setFilter('todos')}
          style={{ ...sideBtn, background: filter === 'todos' ? '#334155' : '#1e293b' }}
        >
          Dashboard
        </button>

        <button
          onClick={() => setFilter('pago_pendiente')}
          style={{ ...sideBtn, background: filter === 'pago_pendiente' ? '#facc15' : '#1e293b', color: filter === 'pago_pendiente' ? '#000' : 'white' }}
        >
          Pendientes
        </button>

        <button
          onClick={() => setFilter('pagado')}
          style={{ ...sideBtn, background: filter === 'pagado' ? '#2563eb' : '#1e293b' }}
        >
          Pagados
        </button>

        <button
          onClick={() => setFilter('aceptado')}
          style={{ ...sideBtn, background: filter === 'aceptado' ? '#16a34a' : '#1e293b' }}
        >
          Aceptados
        </button>

        <button onClick={exportToCSV} style={{ ...sideBtn, background: '#22c55e', marginTop: '2rem' }}>
          Export CSV
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '2rem', background: '#f4f6fb' }}>

        {/* HEADER */}
        <div style={{
          background: '#0f172a',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h1 style={{ margin: 0 }}>United Nations MUN System</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>Delegation Management Dashboard</p>
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={cardStyle}>Total: {total}</div>
          <div style={{ ...cardStyle, background: '#facc15' }}>Pendientes: {pendientes}</div>
          <div style={{ ...cardStyle, background: '#2563eb', color: 'white' }}>Pagados: {pagados}</div>
          <div style={{ ...cardStyle, background: '#16a34a', color: 'white' }}>Aceptados: {aceptados}</div>
        </div>

        {loading && <p>Cargando...</p>}

        {/* CARDS */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredData.map(item => (
            <div key={item.id} style={card}>
              <h3 style={{ margin: 0 }}>{item.nombre_completo}</h3>

              <p>{item.institucion_educativa}</p>
              <p>{item.tipo_inscripcion}</p>
              <p>{item.metodo_pago} - {item.numero_operacion}</p>

              <div style={{ marginTop: '6px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  ...getStatusStyle(item.estado)
                }}>
                  {item.estado}
                </span>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={() => confirmPayment(item.id)} style={greenBtn}>
                  Confirmar pago
                </button>
                <button onClick={() => acceptParticipant(item.id)} style={blueBtn}>
                  Aceptar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}