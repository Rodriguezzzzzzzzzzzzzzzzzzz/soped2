'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Application = {
  id: string
  type: string
  full_name: string
  email: string
  institution: string
  status: string
  created_at: string
}

const statusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return '#16a34a'
    case 'rejected':
      return '#dc2626'
    case 'waitlist':
      return '#2563eb'
    default:
      return '#ca8a04'
  }
}

export default function AdminV2() {
  const COMMITTEE_CAPACITY: Record<string, number> = {
    UNSC: 15,
    ECOSOC: 20,
    OEA: 18,
    'ONU Mujeres': 15,
    CRISIS: 25,
    'TPA (Prensa)': 30,
    ADPIC: 20,
  }
  const [data, setData] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Application | null>(null)

  const fetchData = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('mun_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setData(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('mun_applications')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    fetchData()
  }

  const autoApprove = async (app: any) => {
    const committee = suggestCommittee(app)
    const country = suggestCountry()

    const { error } = await supabase
      .from('mun_applications')
      .update({
        status: 'approved',
        assigned_committee: committee,
        assigned_country: country,
      } as any)
      .eq('id', app.id)

    if (error) {
      alert(error.message)
      return
    }

    fetchData()
    setSelected(null)
  }

  const stats = {
    total: data.length,
    pending: data.filter(x => x.status === 'pending').length,
    approved: data.filter(x => x.status === 'approved').length,
    rejected: data.filter(x => x.status === 'rejected').length,
    waitlist: data.filter(x => x.status === 'waitlist').length,
  }

  const calculateScore = (app: any) => {
    let score = 0

    if (app.type === 'individual') score += 10
    if (app.type === 'delegation_small') score += 15
    if (app.type === 'delegation_medium') score += 20

    if (app.institution?.length > 10) score += 5
    if (app.motivation?.length > 200) score += 10

    return score
  }
  const suggestCommittee = (app: any) => {
    const score = calculateScore(app)

    if (score >= 30) return 'CS'
    if (score >= 25) return 'UNHRC (ENG)'
    if (score >= 22) return 'DISEC'
    if (score >= 20) return 'ECOSOC'
    if (score >= 18) return 'OMS'
    if (score >= 16) return 'OEA'
    if (score >= 14) return 'ONU Mujeres'
    if (score >= 12) return 'PCC'
    return 'CRISIS'
  }

  const suggestCountry = () => {
    const countries = [
      'USA',
      'China',
      'France',
      'UK',
      'Germany',
      'Brazil',
      'India',
      'Peru'
    ]

    return countries.find(c =>
      !data.some(a => (a as any).assigned_country === c)
    ) || 'Peru'
  }

  const isCommitteeFull = (committee: string) => {
    const limit = COMMITTEE_CAPACITY[committee]
    if (!limit) return false

    const count = data.filter(
      (a) => (a as any).assigned_committee === committee
    ).length

    return count >= limit
  }

  const isCountryTaken = (country: string, committee: string) => {
    return data.some(
      (a) =>
        (a as any).assigned_country === country &&
        (a as any).assigned_committee === committee &&
        a.id !== selected?.id
    )
  }

  const filtered = data
    .map((item) => ({
      ...item,
      score: calculateScore(item),
    }))
    .filter((item) => {
      const matchFilter = filter === 'all' || item.status === filter
      const matchSearch =
        item.full_name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())

      return matchFilter && matchSearch
    })
    .sort((a, b) => b.score - a.score)

  return (
    <div style={{ background: '#f6f7fb', minHeight: '100vh', padding: 30 }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 25 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#091c36' }}>
          SoPeD MUN Admin Panel
        </h1>
        <p style={{ color: '#6b7280' }}>
          Gestión de postulaciones MUN
        </p>
      </div>

      {/* KPI DASHBOARD */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ padding: 10, background: '#fff', borderRadius: 8 }}>
          Total: {stats.total}
        </div>
        <div style={{ padding: 10, background: '#fff', borderRadius: 8 }}>
          Pending: {stats.pending}
        </div>
        <div style={{ padding: 10, background: '#fff', borderRadius: 8 }}>
          Approved: {stats.approved}
        </div>
        <div style={{ padding: 10, background: '#fff', borderRadius: 8 }}>
          Rejected: {stats.rejected}
        </div>
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Buscar nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: '1px solid #ddd',
            flex: 1,
          }}
        />

        <select
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: '1px solid #ddd',
          }}
        >
          <option value="all">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
          <option value="waitlist">Waitlist</option>
        </select>
      </div>

      {/* GRID */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 15,
          }}
        >
          {filtered.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelected(app)}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 16,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                border: '1px solid #eee',
              }}
            >
              {/* HEADER CARD */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3 style={{ margin: 0, fontSize: 16 }}>
                  {app.full_name}
                </h3>

                <span
                  style={{
                    background: statusColor(app.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 999,
                    fontSize: 12,
                  }}
                >
                  {app.status}
                </span>
              </div>

              <p style={{ margin: '6px 0', color: '#555' }}>
                {app.email}
              </p>

              <p style={{ margin: '6px 0', color: '#777', fontSize: 13 }}>
                {app.institution}
              </p>

              <p style={{ fontSize: 12, color: '#999' }}>
                Tipo: {app.type}
              </p>

              {/* ACTIONS */}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => autoApprove(app)}
                  style={{
                    flex: 1,
                    padding: 6,
                    borderRadius: 6,
                    border: 'none',
                    background: '#16a34a',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Aprobar
                </button>

                <button
                  onClick={() => updateStatus(app.id, 'rejected')}
                  style={{
                    flex: 1,
                    padding: 6,
                    borderRadius: 6,
                    border: 'none',
                    background: '#dc2626',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Rechazar
                </button>

                <button
                  onClick={() => updateStatus(app.id, 'waitlist')}
                  style={{
                    flex: 1,
                    padding: 6,
                    borderRadius: 6,
                    border: 'none',
                    background: '#2563eb',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Lista
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && (
  <div
    onClick={() => setSelected(null)}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      zIndex: 9999,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: '#fff',
        borderRadius: 12,
        width: '100%',
        maxWidth: 650,
        padding: 22,
      }}
    >
      <h2 style={{ marginTop: 0 }}>{selected.full_name}</h2>
      <p style={{ background: '#eef2ff', padding: 10, borderRadius: 8 }}>
        🧠 Sugerido:
        <br />
        Comité: <b>{suggestCommittee(selected)}</b>
        <br />
        País: <b>{suggestCountry()}</b>
      </p>

      <button
        onClick={() =>
          setSelected({
            ...selected!,
            assigned_committee: suggestCommittee(selected),
            assigned_country: suggestCountry(),
          } as any)
        }
        style={{
          width: '100%',
          marginBottom: 12,
          padding: 10,
          background: '#111827',
          color: 'white',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Aplicar sugerencia automática
      </button>

      <p><b>Email:</b> {selected.email}</p>
      <p><b>Institución:</b> {selected.institution}</p>
      <p><b>Tipo:</b> {selected.type}</p>
      <p><b>Estado:</b> {selected.status}</p>

      <hr />

      {/* ASIGNACIÓN MUN */}
      <h3>Asignación MUN</h3>

      <div
        style={{
          marginBottom: 12,
          padding: 12,
          background: '#f8fafc',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          fontSize: 13,
          color: '#374151',
        }}
      >
        <b>Comités disponibles:</b>
        <br />
        CS, ECOSOC, CRISIS, PCC, ONU Mujeres, OEA, OMS, DISEC,
        TPA, UNHRC (ENG), UNHRC (ESP), UNSC, TPA (Prensa), ADPIC
      </div>

      <select
        value={(selected as any).assigned_committee || ''}
        onChange={(e) => {
          const value = e.target.value

          if (isCommitteeFull(value)) {
            alert('⚠ Este comité ya alcanzó su capacidad máxima')
            return
          }

          setSelected({
            ...selected!,
            assigned_committee: value,
          } as any)
        }}
        style={{
          width: '100%',
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          border: '1px solid #ddd',
        }}
      >
        <option value="">Seleccionar comité</option>
        <option value="CS">CS — Consejo de Seguridad</option>
        <option value="ECOSOC">ECOSOC — Consejo Económico y Social</option>
        <option value="CRISIS">CRISIS — Crisis Fantástica I</option>
        <option value="PCC">PCC — Consejo de Contingencia Planetaria</option>
        <option value="ONU Mujeres">ONU Mujeres</option>
        <option value="OEA">OEA — Organización de los Estados Americanos</option>
        <option value="OMS">OMS — Organización Mundial de la Salud</option>
        <option value="DISEC">DISEC — Desarme y Seguridad Internacional</option>
        <option value="TPA">TPA — Third Party Actors</option>
        <option value="UNHRC (ENG)">UNHRC (ENG) — Presencial</option>
        <option value="UNHRC (ESP)">UNHRC (ESP) — Virtual</option>
        <option value="UNSC">UNSC</option>
        <option value="TPA (Prensa)">TPA (Prensa)</option>
        <option value="ADPIC">ADPIC</option>
      </select>

      <select
        value={(selected as any).assigned_country || ''}
        onChange={(e) =>
          setSelected({
            ...selected!,
            assigned_country: e.target.value,
          } as any)
        }
        style={{
          width: '100%',
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          border: '1px solid #ddd',
        }}
      >
        <option value="">Seleccionar país</option>
        {[
          'Peru',
          'USA',
          'China',
          'France',
          'UK',
          'Germany',
          'Brazil',
          'India'
        ].map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {isCountryTaken(
        (selected as any)?.assigned_country,
        (selected as any)?.assigned_committee
      ) && (
        <p style={{ color: 'red', fontSize: 12, marginTop: 0 }}>
          ⚠ Este país ya está asignado en este comité
        </p>
      )}

      <hr />

      {/* ACTIONS */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => autoApprove(selected)}>
          Aprobar
        </button>

        <button onClick={() => updateStatus(selected.id, 'rejected')}>
          Rechazar
        </button>

        <button onClick={() => updateStatus(selected.id, 'waitlist')}>
          Waitlist
        </button>
      </div>

      <button
        onClick={() => setSelected(null)}
        style={{ marginTop: 15, width: '100%' }}
      >
        Cerrar
      </button>
    </div>
  </div>
)}
    </div>
  )
}