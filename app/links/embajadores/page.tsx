import type { Metadata } from 'next'
import EmbeddedGoogleForm from '@/components/forms/EmbeddedGoogleForm'
import '../links-form.css'

export const metadata: Metadata = {
  title: 'Postulación de Embajadores',
  description:
    'Formulario oficial de postulación al Programa de Embajadores SOPEDMUN 2026 — Sociedad Peruana de Debate.',
}

export default function EmbajadoresPage() {
  return (
    <EmbeddedGoogleForm
      iframeSrc="https://docs.google.com/forms/d/e/1FAIpQLSf2QvBqDN2luRPGgiWOrC4GHKjZMibHMoxhPQbbFG6HQNQKVw/viewform?embedded=true"
      externalUrl="https://docs.google.com/forms/d/e/1FAIpQLSf2QvBqDN2luRPGgiWOrC4GHKjZMibHMoxhPQbbFG6HQNQKVw/viewform?usp=dialog"
      title="Postulación de Embajadores"
      description="Completa el formulario oficial para postular al Programa de Embajadores SOPEDMUN 2026."
      iframeTitle="Formulario de Postulación de Embajadores SOPEDMUN"
      iframeHeight={2225}
    />
  )
}
