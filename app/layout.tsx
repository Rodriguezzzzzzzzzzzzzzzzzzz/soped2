import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/layout/Navbar'
import PageTransition from './providers/PageTransition'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'SoPeD — Sociedad Peruana de Debate',
  description:
    'Plataforma institucional de la Sociedad Peruana de Debate.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body style={{ backgroundColor: '#05070d' }}>
  <Navbar />
  <div style={{ minHeight: '100vh', backgroundColor: '#05070d' }}>
    <PageTransition>{children}</PageTransition>
  </div>

  <Footer />
</body>
    </html>
  )
}