import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/layout/Navbar'
import PageTransition from './providers/PageTransition'
import Footer from '../components/layout/Footer'
import SsrCover from '../components/layout/SsrCover'

export const metadata: Metadata = {
  title: {
    default: 'SoPeD — Sociedad Peruana de Debate',
    template: '%s | SoPeD',
  },
  description:
    'SoPeD — Sociedad Peruana de Debate. Plataforma académica líder en debate competitivo del Perú. Formamos líderes, diplomáticos y oradores mediante estándares internacionales de excelencia.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      { url: '/soped.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icon-192.png', sizes: '192x192' },
      { url: '/soped.svg' },
    ],
    other: { rel: 'apple-touch-icon-precomposed', url: '/icon-192.png' },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'SoPeD — Sociedad Peruana de Debate',
    description:
      'Plataforma académica líder en debate competitivo del Perú. Formamos líderes, diplomáticos y oradores.',
    url: 'https://soped.pe',
    siteName: 'SoPeD',
    images: [{ url: '/icon-512.png', width: 512, height: 512 }],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoPeD — Sociedad Peruana de Debate',
    description:
      'Plataforma académica líder en debate competitivo del Perú. Formamos líderes, diplomáticos y oradores.',
    images: ['/icon-512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
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
