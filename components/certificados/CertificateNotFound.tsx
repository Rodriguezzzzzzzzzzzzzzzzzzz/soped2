export default function CertificateNotFound() {
  return (
    <div
      className="glass"
      style={{
        maxWidth: 560,
        margin: '0 auto',
        padding: '3rem 2.5rem',
        textAlign: 'center',
      }}
    >
      {/* Big faded number */}
      <div
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '5rem',
          fontWeight: 700,
          color: 'rgba(124,1,26,0.15)',
          lineHeight: 1,
          marginBottom: '0.5rem',
          userSelect: 'none',
        }}
      >
        404
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(236,229,214,0.6)',
          marginBottom: '0.75rem',
        }}
      >
        Certificado no encontrado
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.7,
          maxWidth: 380,
          margin: '0 auto 1.5rem',
        }}
      >
        El código ingresado no corresponde a ningún certificado emitido por SoPeD.
        Verifique el código e intente nuevamente.
      </p>

      <div
        style={{
          width: 40,
          height: 1,
          background: 'rgba(236,229,214,0.15)',
          margin: '0 auto',
        }}
      />
    </div>
  )
}
