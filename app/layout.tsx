import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SoPeD — Sociedad Peruana de Debate',
  description: 'Plataforma institucional de la Sociedad Peruana de Debate. MUN, debate escolar, formación académica y competencias internacionales.',
  keywords: ['debate', 'MUN', 'Perú', 'oratoria', 'SoPeD', 'modelo de naciones unidas'],
  openGraph: {
    title: 'SoPeD — Sociedad Peruana de Debate',
    description: 'Plataforma institucional académica de la Sociedad Peruana de Debate.',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
