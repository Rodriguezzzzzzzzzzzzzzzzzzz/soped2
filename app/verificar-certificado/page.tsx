import { Suspense } from 'react'
import CertificateSearchClient from './CertificateSearchClient'

export default function VerificarCertificadoPage() {
  return (
    <Suspense>
      <CertificateSearchClient />
    </Suspense>
  )
}
