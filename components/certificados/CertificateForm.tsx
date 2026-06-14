'use client'

interface Props {
  onSearch: (code: string) => void
  loading?: boolean
}

export default function CertificateForm({ onSearch, loading }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const code = data.get('code') as string
    if (code.trim()) onSearch(code.trim())
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="label-glass" htmlFor="cert-code">
            Código del certificado
          </label>
          <input
            id="cert-code"
            name="code"
            type="text"
            className="input-glass"
            placeholder="SOPED-2026-MUN-001847"
            autoComplete="off"
            spellCheck={false}
            style={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{
            padding: '0.875rem 1.75rem',
          }}
        >
          {loading ? 'Buscando…' : 'Verificar certificado'}
        </button>
      </div>
    </form>
  )
}
