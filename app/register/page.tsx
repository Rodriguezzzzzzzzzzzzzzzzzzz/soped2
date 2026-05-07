'use client'

import { useEffect, useMemo, useState } from 'react'

type Delegate = {
  name: string
  isHead: boolean
}

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [selectedType, setSelectedType] = useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    committee: '',
    country: '',
    role: 'delegate',
    institutionName: '',
    institutionRep: '',
    institutionEmail: '',
  })

  const [delegates, setDelegates] = useState<Delegate[]>([
    { name: '', isHead: true },
  ])

  const [hasFaculty, setHasFaculty] = useState(false)
  const [facultyName, setFacultyName] = useState('')

  // Reset form when type changes (production-safe behavior)
  useEffect(() => {
    setError(null)
    setMessage(null)

    setForm({
      fullName: '',
      email: '',
      committee: '',
      country: '',
      role: 'delegate',
      institutionName: '',
      institutionRep: '',
      institutionEmail: '',
    })

    setDelegates([{ name: '', isHead: true }])
    setHasFaculty(false)
    setFacultyName('')
  }, [selectedType])

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const addDelegate = () => {
    setDelegates(prev => [...prev, { name: '', isHead: false }])
  }

  const updateDelegate = (index: number, value: string) => {
    const copy = [...delegates]
    copy[index].name = value
    setDelegates(copy)
  }

  const setHead = (index: number) => {
    setDelegates(prev =>
      prev.map((d, i) => ({
        ...d,
        isHead: i === index,
      }))
    )
  }

  const validation = useMemo(() => {
    if (!selectedType) return { ok: false, reason: 'Selecciona un tipo de registro' }

    if (selectedType === 'individual') {
      if (!form.fullName || !form.email || !form.committee || !form.country) {
        return { ok: false, reason: 'Completa todos los campos obligatorios' }
      }
    }

    if (selectedType === 'small' || selectedType === 'medium' || selectedType === 'large') {
      const validDelegates = delegates.filter(d => d.name.trim().length > 0)
      const hasHead = delegates.some(d => d.isHead && d.name.trim().length > 0)

      if (validDelegates.length < 2) {
        return { ok: false, reason: 'La delegación debe tener al menos 2 delegados' }
      }

      if (!hasHead) {
        return { ok: false, reason: 'Debes seleccionar un Head Delegate válido' }
      }
    }

    if (selectedType === 'institution') {
      if (!form.institutionName || !form.institutionRep || !form.institutionEmail) {
        return { ok: false, reason: 'Completa los datos de la institución' }
      }
    }

    return { ok: true, reason: null }
  }, [selectedType, form, delegates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!validation.ok) {
      setError(validation.reason)
      return
    }

    setLoading(true)

    const payload = {
      ...form,
      type: selectedType,
      delegates: delegates.filter(d => d.name.trim().length > 0),
      facultyName: hasFaculty ? facultyName : null,
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al registrar')
      } else {
        setMessage('Registro exitoso')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const typeLabel = (type: string) => {
    switch (type) {
      case 'individual':
        return 'Delegado individual'
      case 'small':
        return 'Delegación pequeña'
      case 'medium':
        return 'Delegación mediana'
      case 'large':
        return 'Delegación grande'
      case 'institution':
        return 'Institución oficial'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Registro MUN</h1>

      {/* SELECCIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-8">
        {['individual', 'small', 'medium', 'large', 'institution'].map(type => (
          <div
            key={type}
            onClick={() => handleTypeSelect(type)}
            className={`cursor-pointer p-5 rounded-xl border transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
              selectedType === type ? 'border-blue-500 scale-[1.02]' : 'border-gray-200'
            }`}
          >
            <p className="font-semibold text-center">
              {typeLabel(type)}
            </p>
          </div>
        ))}
      </div>

      {/* FORM */}
      {selectedType && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md flex flex-col gap-3 transition-all duration-300"
        >

          {/* INDIVIDUAL */}
          {selectedType === 'individual' && (
            <>
              <h2 className="font-semibold text-lg">Información personal</h2>

              <input className="border p-2 rounded" name="fullName" placeholder="Nombre completo" onChange={handleChange} />
              <input className="border p-2 rounded" name="email" placeholder="Correo" onChange={handleChange} />

              <h2 className="font-semibold text-lg mt-4">Asignación MUN</h2>

            </>
          )}

          {/* DELEGACIONES */}
          {(selectedType === 'small' || selectedType === 'medium' || selectedType === 'large') && (
            <>
              <h2 className="font-semibold text-lg">Delegación</h2>

              {delegates.map((d, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    className="border p-2 rounded flex-1"
                    placeholder={`Delegado ${i + 1}`}
                    value={d.name}
                    onChange={(e) => updateDelegate(i, e.target.value)}
                  />

                  <label className="text-sm flex items-center gap-1">
                    <input
                      type="radio"
                      checked={d.isHead}
                      onChange={() => setHead(i)}
                    />
                    Head
                  </label>
                </div>
              ))}

              <button type="button" onClick={addDelegate} className="text-blue-600 text-sm">
                + Agregar delegado
              </button>

              <label className="flex items-center gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  checked={hasFaculty}
                  onChange={() => setHasFaculty(!hasFaculty)}
                />
                Faculty Advisor
              </label>

              {hasFaculty && (
                <input
                  className="border p-2 rounded"
                  placeholder="Nombre faculty"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                />
              )}
            </>
          )}

          {/* INSTITUCIÓN */}
          {selectedType === 'institution' && (
            <>
              <h2 className="font-semibold text-lg">Institución oficial</h2>

              <input className="border p-2 rounded" name="institutionName" placeholder="Nombre institución" onChange={handleChange} />
              <input className="border p-2 rounded" name="institutionRep" placeholder="Representante" onChange={handleChange} />
              <input className="border p-2 rounded" name="institutionEmail" placeholder="Email institucional" onChange={handleChange} />
            </>
          )}

          {/* STATUS */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            disabled={loading || !validation.ok}
            className="bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      )}
    </div>
  )
}
