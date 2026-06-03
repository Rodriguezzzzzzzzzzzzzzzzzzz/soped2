import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background:
          'radial-gradient(circle at top, #1a0008 0%, #040202 60%, #000000 100%)',
        color: 'white',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          width: '100%',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '2.5rem',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Image
          src="/placard.svg"
          alt="Página no encontrada"
          width={420}
          height={420}
          priority
          style={{
            width: '100%',
            maxWidth: '420px',
            height: 'auto',
            margin: '0 auto 1.5rem',
          }}
        />

        <p
          style={{
            fontSize: '0.95rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.7,
            marginBottom: '0.5rem',
          }}
        >
          Punto de Orden (404)
        </p>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            margin: 0,
          }}
        >
          Esa moción no está en orden.
        </h1>

        <p
          style={{
            marginTop: '1rem',
            opacity: 0.8,
            lineHeight: 1.7,
          }}
        >
          La página que buscas no fue admitida a debate. Es posible que nunca haya existido, haya sido retirada de la agenda o que la dirección esté fuera de orden.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '1.5rem',
            padding: '0.9rem 1.4rem',
            borderRadius: '12px',
            background: 'white',
            color: '#040202',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Regresar al debate
        </Link>
      </div>
    </div>
  )
}