import type { Metadata } from 'next'
import EmbeddedGoogleForm from '@/components/forms/EmbeddedGoogleForm'
import '../links-form.css'

export const metadata: Metadata = {
  title: 'Postulación Comunicaciones',
  description:
    'Formulario de postulación al Departamento de Comunicaciones SOPEDMUN 2026 — Sociedad Peruana de Debate.',
}

export default function ComunicacionesPage() {
  return (
    <EmbeddedGoogleForm
      iframeSrc="https://docs.google.com/forms/d/e/1FAIpQLSdaMSoTYN2V8VjnEXTSg0MNu_chnzZ8p-oZnG8SYUa4ZGUPhw/viewform?embedded=true"
      externalUrl="https://docs.google.com/forms/d/e/1FAIpQLSdaMSoTYN2V8VjnEXTSg0MNu_chnzZ8p-oZnG8SYUa4ZGUPhw/viewform?usp=dialog"
      title="Postulación al Dpto. de Comunicaciones"
      description="Completa el formulario para postular al equipo de Comunicaciones del SOPEDMUN 2026."
      iframeTitle="Formulario de Postulación Comunicaciones SOPEDMUN"
      iframeHeight={1947}
    />
  )
}
