import type { Certificate } from '@/data/certificates'

interface Props {
  certificate: Certificate
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre',
  ]
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`
}

export default function CertificateResult({ certificate }: Props) {
  const { fullName, program, participation, issueDate, code, status } = certificate

  return (
    <div
      className="glass"
      style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Red corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 120,
          height: 120,
          background: 'linear-gradient(135deg, transparent 50%, rgba(160,16,40,0.12) 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="deco-line" />
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(236,229,214,0.7)' }}>
              Certificado verificado
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 500, color: '#fff', lineHeight: 1.2, margin: 0 }}>
            {fullName}
          </h2>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#ECE5D6',
            border: '1px solid rgba(236,229,214,0.4)',
            padding: '0.3rem 0.75rem',
            flexShrink: 0,
          }}
        >
          VÁLIDO
        </span>
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Row label="Programa" value={program} />
        <Row label="Participación" value={participation} />
        <Row label="Fecha de emisión" value={formatDate(issueDate)} />
        <Row label="Código único" value={code} mono />
      </div>

      {/* Gold line */}
      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(236,229,214,0.2), transparent)',
          marginTop: '1.5rem',
          marginBottom: '1rem',
        }}
      />

      {/* Footer */}
      <p
        style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
          letterSpacing: '0.05em',
          margin: 0,
        }}
      >
        Este certificado fue emitido por la Sociedad Peruana de Debate.
        Verifique su autenticidad en soped.pe/verificar-certificado
      </p>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <span
        style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'var(--font-outfit)',
          fontSize: mono ? '0.78rem' : '0.95rem',
          fontWeight: mono ? 400 : 400,
          color: '#fff',
          textAlign: 'right',
          wordBreak: 'break-all',
          letterSpacing: mono ? '0.04em' : 'normal',
        }}
      >
        {value}
      </span>
    </div>
  )
}
