import type { Metadata } from 'next'
import EmbeddedGoogleForm from '@/components/forms/EmbeddedGoogleForm'
import '../links-form.css'

export const metadata: Metadata = {
  title: 'Postulación Staff y Voluntariado',
  description:
    'Formulario de postulación al Departamento de Staff y Voluntariado SOPEDMUN 2026 — Sociedad Peruana de Debate.',
}

export default function StaffVoluntariadoPage() {
  return (
    <EmbeddedGoogleForm
      iframeSrc="https://docs.google.com/forms/d/e/1FAIpQLSdaMSoTYN2V8VjnEXTSg0MNu_chnzZ8p-oZnG8SYUa4ZGUPhw/viewform?embedded=true"
      externalUrl="https://docs.google.com/forms/d/e/1FAIpQLSdaMSoTYN2V8VjnEXTSg0MNu_chnzZ8p-oZnG8SYUa4ZGUPhw/viewform?usp=dialog"
      title="Postulación al Dpto. de Staff y Voluntariado"
      description="Completa el formulario para postular al equipo organizador: logística, protocolo, prensa y soporte operacional."
      iframeTitle="Formulario de Postulación Staff y Voluntariado SOPEDMUN"
      iframeHeight={1947}
    />
  )
}
