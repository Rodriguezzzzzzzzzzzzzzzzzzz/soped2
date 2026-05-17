'use client'

import { useState } from 'react'

type Country = {
  name: string
  flag: string
}

const countries: Country[] = [
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'UK', flag: '🇬🇧' }
]

export default function ChairPanel() {
  const [step, setStep] = useState<
    'setup' | 'agenda' | 'rollcall' | 'speakers' | 'motions'
  >('setup')

  const [committeeType, setCommitteeType] = useState('')
  const [customCommittee, setCustomCommittee] = useState('')
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([])
  const [agenda, setAgenda] = useState<string[]>([])
  const [agendaInput, setAgendaInput] = useState('')

  const [countryStatus, setCountryStatus] = useState<Record<string, 'present' | 'voting' | 'absent'>>({})
  const [speakers, setSpeakers] = useState<string[]>([])

  const [motionActive, setMotionActive] = useState(false)
  const [motionTime, setMotionTime] = useState(0)
  const [motionType, setMotionType] = useState<'debate' | 'resolution' | 'procedure' | ''>('')
  const [motionSubtype, setMotionSubtype] = useState('')
  const [motionDurationInput, setMotionDurationInput] = useState(60)

  // -------------------------
  // COUNTRY SELECTION
  // -------------------------
  const toggleCountry = (country: Country) => {
    const exists = selectedCountries.find(c => c.name === country.name)

    if (exists) {
      setSelectedCountries(selectedCountries.filter(c => c.name !== country.name))
    } else {
      setSelectedCountries([...selectedCountries, country])
    }
  }

  // -------------------------
  // AGENDA
  // -------------------------
  const addAgenda = () => {
    if (!agendaInput.trim()) return
    setAgenda([...agenda, agendaInput])
    setAgendaInput('')
  }

  // -------------------------
  // NEXT STEP FLOW
  // -------------------------
  const nextStep = () => {
    const order = ['setup', 'agenda', 'rollcall', 'speakers', 'motions']
    const currentIndex = order.indexOf(step)
    const next = order[currentIndex + 1] as any

    // When entering rollcall, initialize statuses
    if (next === 'rollcall') {
      const initialStatus: any = {}
      selectedCountries.forEach(c => {
        initialStatus[c.name] = 'present'
      })
      setCountryStatus(initialStatus)
    }

    setStep(next)
  }

  const updateStatus = (name: string, status: 'present' | 'voting' | 'absent') => {
    setCountryStatus({
      ...countryStatus,
      [name]: status
    })
  }

  const present = Object.values(countryStatus).filter(s => s === 'present').length
  const voting = Object.values(countryStatus).filter(s => s === 'voting').length
  const absent = Object.values(countryStatus).filter(s => s === 'absent').length

  const total = selectedCountries.length

  const simpleQuorum = present + voting >= Math.ceil(total / 2)
  const compoundQuorum = voting >= Math.ceil(total * 0.6)

  const addSpeaker = (name: string) => {
    if (speakers.includes(name)) return
    setSpeakers([...speakers, name])
  }

  const startMotion = (seconds: number) => {
    if (!motionSubtype) return

    setMotionActive(true)
    setMotionTime(seconds)

    setTimeout(() => {
      setMotionActive(false)
      setMotionTime(0)
      setMotionType('')
      setMotionSubtype('')
    }, seconds * 1000)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fb' }}>
      <div style={{ flex: 1, padding: '2rem' }}>

        {/* HEADER */}
        <div style={{
          background: '#0f172a',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h1 style={{ margin: 0 }}>MUN Chair System</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>
            Committee Simulation Engine
          </p>
        </div>

        {/* STEP: SETUP */}
        {step === 'setup' && (
          <div style={{ display: 'grid', gap: '1rem' }}>

            <h2>1. Setup del Comité</h2>

            <select
              value={committeeType}
              onChange={(e) => setCommitteeType(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px' }}
            >
              <option value="">Seleccionar comité</option>
              <option value="UNGA">UN General Assembly</option>
              <option value="UNSC">Security Council</option>
              <option value="custom">Personalizado</option>
            </select>

            {committeeType === 'custom' && (
              <input
                value={customCommittee}
                onChange={(e) => setCustomCommittee(e.target.value)}
                placeholder="Nombre del comité personalizado"
                style={{ padding: '10px', borderRadius: '8px' }}
              />
            )}

            <button onClick={nextStep} style={btn}>
              Siguiente
            </button>
          </div>
        )}

        {/* STEP: AGENDA */}
        {step === 'agenda' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <h2>2. Agenda</h2>

            <input
              value={agendaInput}
              onChange={(e) => setAgendaInput(e.target.value)}
              placeholder="Escribir tema..."
              style={{ padding: '10px', borderRadius: '8px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={addAgenda} style={smallBtn}>
                Añadir tema
              </button>
            </div>

            <ul>
              {agenda.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <button onClick={nextStep} style={btn}>
              Siguiente
            </button>
          </div>
        )}

        {/* STEP: COUNTRY SELECTION */}
        {step === 'rollcall' && (
          <div>

            {/* QUORUM HEADER */}
            <div style={{
              background: '#0f172a',
              color: 'white',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1rem'
            }}>
              <div>Total: {total}</div>
              <div>Presentes: {present}</div>
              <div>Votando: {voting}</div>
              <div>Ausentes: {absent}</div>

              <div style={{ marginTop: '8px' }}>
                Quorum simple: {simpleQuorum ? '✔' : '❌'} | Quorum compuesto: {compoundQuorum ? '✔' : '❌'}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>

              {selectedCountries.map(c => (
                <div
                  key={c.name}
                  style={{
                    background: 'white',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    {c.flag} {c.name}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => updateStatus(c.name, 'present')} style={btn}>
                      Presente
                    </button>

                    <button onClick={() => updateStatus(c.name, 'voting')} style={smallBtn}>
                      Votando
                    </button>

                    <button onClick={() => updateStatus(c.name, 'absent')} style={{
                      ...smallBtn,
                      background: '#ef4444'
                    }}>
                      Ausente
                    </button>

                    <button
                      onClick={() => addSpeaker(c.name)}
                      style={{
                        ...smallBtn,
                        background: '#10b981'
                      }}
                    >
                      Orador
                    </button>
                  </div>

                  <div style={{ marginLeft: '10px' }}>
                    Status: {countryStatus[c.name]}
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* STEP: SPEAKERS */}
        {step === 'speakers' && (
          <div>

            <div style={{
              background: '#0f172a',
              color: 'white',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: 0 }}>Speakers List</h3>
              <p style={{ margin: 0, opacity: 0.7 }}>
                Orden de intervención del comité
              </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>

              {/* AVAILABLE */}
              <div style={{ flex: 1 }}>
                <h3>Países</h3>

                {selectedCountries.map(c => (
                  <div
                    key={c.name}
                    style={{
                      background: 'white',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      marginBottom: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {c.flag} {c.name}

                    <div style={{ marginTop: '6px' }}>
                      <button
                        onClick={() => addSpeaker(c.name)}
                        style={{
                          ...smallBtn,
                          background: '#10b981'
                        }}
                      >
                        Agregar a oradores
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SPEAKERS LIST */}
              <div style={{ flex: 1 }}>
                <h3>Lista de Oradores</h3>

                <div style={{
                  minHeight: '200px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  padding: '10px',
                  border: '1px dashed #ccc'
                }}>
                  {speakers.map((s, i) => (
                    <div
                      key={s}
                      style={{
                        padding: '8px',
                        background: 'white',
                        marginBottom: '6px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        transform: 'translateX(0)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      #{i + 1} {s}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP: MOTIONS */}
        {step === 'motions' && (
          <div>

            <div style={{
              background: '#0f172a',
              color: 'white',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: 0 }}>Motions Engine</h3>
              <p style={{ margin: 0, opacity: 0.7 }}>
                Control del debate parlamentario
              </p>
            </div>

            {/* ACTIVE MOTION STATUS */}
            <div style={{
              padding: '10px',
              borderRadius: '10px',
              background: motionActive ? '#16a34a' : '#334155',
              color: 'white',
              marginBottom: '1rem'
            }}>
              {motionActive
                ? `🔴 Motion activa: ${motionType} - ${motionSubtype} (${motionTime}s)`
                : 'Sin moción activa'}
            </div>

            {/* MOTION TYPES */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>

              <button
                onClick={() => {
                  setMotionType('debate')
                  setMotionSubtype('')
                }}
                style={{
                  ...smallBtn,
                  background: motionType === 'debate' ? '#2563eb' : '#64748b'
                }}
              >
                Debate
              </button>

              <button
                onClick={() => {
                  setMotionType('resolution')
                  setMotionSubtype('')
                }}
                style={{
                  ...smallBtn,
                  background: motionType === 'resolution' ? '#2563eb' : '#64748b'
                }}
              >
                Resolución
              </button>

              <button
                onClick={() => {
                  setMotionType('procedure')
                  setMotionSubtype('')
                }}
                style={{
                  ...smallBtn,
                  background: motionType === 'procedure' ? '#2563eb' : '#64748b'
                }}
              >
                Procedimiento
              </button>

            </div>

            {/* SUBTYPES */}
            {motionType === 'debate' && (
              <div style={{ display: 'grid', gap: '8px', marginBottom: '1rem' }}>
                {['caucus moderado', 'caucus no moderado', 'debate abierto', 'consulta gabinete'].map(t => (
                  <button
                    key={t}
                    onClick={() => setMotionSubtype(t)}
                    style={{
                      ...smallBtn,
                      background: motionSubtype === t ? '#10b981' : '#1e293b'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {motionType === 'resolution' && (
              <div style={{ display: 'grid', gap: '8px', marginBottom: '1rem' }}>
                {['anteproyecto', 'presentación', 'enmiendas', 'votación'].map(t => (
                  <button
                    key={t}
                    onClick={() => setMotionSubtype(t)}
                    style={{
                      ...smallBtn,
                      background: motionSubtype === t ? '#10b981' : '#1e293b'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {motionType === 'procedure' && (
              <div style={{ display: 'grid', gap: '8px', marginBottom: '1rem' }}>
                {['suspender debate', 'cerrar debate', 'reabrir sesión'].map(t => (
                  <button
                    key={t}
                    onClick={() => setMotionSubtype(t)}
                    style={{
                      ...smallBtn,
                      background: motionSubtype === t ? '#10b981' : '#1e293b'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* TIMER INPUT */}
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="number"
                value={motionDurationInput}
                onChange={(e) => setMotionDurationInput(Number(e.target.value))}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  width: '120px'
                }}
              />
              <span style={{ marginLeft: '10px' }}>segundos</span>
            </div>

            {/* START BUTTON */}
            <button
              onClick={() => startMotion(motionDurationInput)}
              style={{
                ...btn,
                background: '#ef4444'
              }}
            >
              Iniciar moción
            </button>

          </div>
        )}

        {/* NAV BUTTON */}
        {step !== 'setup' && (
          <div style={{ marginTop: '2rem' }}>
            <button onClick={nextStep} style={btn}>
              Siguiente
            </button>
          </div>
        )}

      </div>

      {/* RIGHT ROOM PANEL */}
      <div style={{
        width: '320px',
        background: '#0f172a',
        color: 'white',
        padding: '1rem',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>

        <h3>Room Layout</h3>

        {/* MOTION STATUS */}
        <div style={{
          padding: '10px',
          borderRadius: '10px',
          background: motionActive ? '#16a34a' : '#1e293b',
          marginBottom: '1rem',
          transition: 'all 0.3s ease'
        }}>
          {motionActive ? `Motion activa: ${motionTime}s` : 'Sin moción activa'}
        </div>

        {/* SIMPLE ROOM VISUAL */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginTop: '1rem'
        }}>
          {selectedCountries.map((c) => (
            <div
              key={c.name}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: motionActive ? '#22c55e' : '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                textAlign: 'center',
                transition: 'all 0.5s ease',
                animation: motionActive ? 'pulse 1s infinite' : 'none'
              }}
            >
              {c.flag}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem', fontSize: '12px', opacity: 0.7 }}>
          Distribución de sala (simulación MUN)
        </div>

      </div>
    </div>
  )
}

/* STYLES */
const btn = {
  padding: '10px 15px',
  background: '#0f172a',
  color: 'white',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer'
}

const smallBtn = {
  padding: '6px 10px',
  background: '#2563eb',
  color: 'white',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer'
}

const styleTag = `
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
`
