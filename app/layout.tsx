import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/layout/Navbar'
import PageTransition from './providers/PageTransition'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'SoPeD — Sociedad Peruana de Debate',
  description: 'Plataforma institucional de la Sociedad Peruana de Debate.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnect for faster font load */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          html, body {
            background-color: #0F0A0B;
            color: #f0ece4;
          }
        `}</style>
      </head>
      <body style={{ margin: 0, minHeight: '100vh', backgroundColor: '#0F0A0B', color: '#f0ece4' }}>
        <Navbar />
        <PageTransition>
          {children}
        </PageTransition>
        <Footer />
      </body>
    </html>
  )
}
