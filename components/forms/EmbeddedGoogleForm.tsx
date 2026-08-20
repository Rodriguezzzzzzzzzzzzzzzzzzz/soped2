import { BackButton } from '@/components/ui/back-button'

type EmbeddedGoogleFormProps = {
  iframeSrc: string
  externalUrl: string
  title: string
  description?: string
  tag?: string
  iframeTitle?: string
  iframeHeight?: number
  backHref?: string
  backLabel?: string
}

export default function EmbeddedGoogleForm({
  iframeSrc,
  externalUrl,
  title,
  description,
  tag = 'SOPEDMUN 2026',
  iframeTitle,
  iframeHeight = 1200,
  backHref = '/links',
  backLabel = 'Volver a accesos',
}: EmbeddedGoogleFormProps) {
  return (
    <div className="lf-page">
      <div className="lf-wrap">
        <div className="lf-screen">
          {/* ── Back navigation ── */}
          <BackButton href={backHref}>{backLabel}</BackButton>

          {/* ── Form header ── */}
          <div className="lf-fhead">
            <div className="lf-fhead__tag">{tag}</div>
            <h2 className="lf-fhead__title">{title}</h2>
            {description && (
              <p className="lf-fhead__sub">{description}</p>
            )}
          </div>

          {/* ── Form body ── */}
          <div className="lf-fbody">
            <div className="lf-form-embed">
              <iframe
                src={iframeSrc}
                width="100%"
                height={iframeHeight}
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title={iframeTitle || title}
              >
                Cargando formulario...
              </iframe>
            </div>

            {/* ── Fallback ── */}
            <div className="lf-form-help">
              <div className="lf-form-help__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 3h8l4 4v14H6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M9 11h6M9 15h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="lf-form-help__title">¿No puedes ver el formulario?</h3>
              <p className="lf-form-help__text">
                Si el formulario no carga correctamente, puedes abrirlo directamente
                en una nueva pestaña e iniciar sesión con tu cuenta de Google.
              </p>
              <a
                className="lf-form-help__btn"
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir formulario
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.5 12.5 12.5 3.5M12.5 3.5H6M12.5 3.5v6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <p className="lf-form-help__note">
                No necesitas volver a la página anterior ni recargar el formulario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
