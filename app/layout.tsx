import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/layout/Navbar'
import PageTransition from './providers/PageTransition'
import Footer from '../components/layout/Footer'
import SsrCover from '../components/layout/SsrCover'

export const metadata: Metadata = {
  title: 'SoPeD — Sociedad Peruana de Debate',
  description: 'Plataforma institucional de la Sociedad Peruana de Debate.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preload hero videos so no black frames on navigation */}
        <link rel="preload" href="/mun-bg.mp4" as="video" />
        <link rel="preload" href="/heromunpage.mp4" as="video" />
        <link rel="preload" href="/DEBATEFONDOVIDEO.mp4" as="video" />
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
            background-color: #1C0408;
            color: #f0ece4;
          }
        `}</style>
      </head>
      <body style={{ margin: 0, minHeight: '100vh', backgroundColor: '#1C0408', color: '#f0ece4' }}>
        <div id="soped-ssr-cover" style={{ position: 'fixed', inset: 0, backgroundColor: '#1C0408', zIndex: 99999 }} />
        <SsrCover />
        <Navbar />
        <main className="soped-bg" style={{ paddingTop: 'var(--navbar-height)' }}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  )
}
