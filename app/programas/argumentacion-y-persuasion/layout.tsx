import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taller de Argumentación y Persuasión — SoPeD',
  description:
    'Programa de pensamiento crítico y comunicación persuasiva. Construcción argumentativa, retórica, falacias y debate de alto impacto.',
  openGraph: {
    title: 'Taller de Argumentación y Persuasión — SoPeD',
    description:
      'Pensamiento crítico, retórica y persuasión de alto impacto. Construcción argumentativa y debate formal.',
    siteName: 'SoPeD — Sociedad Peruana de Debate',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function ArgumentacionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
