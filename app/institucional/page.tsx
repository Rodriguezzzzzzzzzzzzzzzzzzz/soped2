import type { Metadata } from 'next'
import './institucional.css'

export const metadata: Metadata = {
  title: 'Información Institucional | Sociedad Peruana de Debate – SoPeD',
  description:
    'Información institucional de la Sociedad Peruana de Debate – SoPeD, asociación civil sin fines de lucro dedicada al debate, la argumentación, el pensamiento crítico y la formación de liderazgo.',
}

const SECTIONS = [
  {
    id: 'programas',
    title: 'Programas y líneas de acción',
    items: [
      {
        label: 'Debate y argumentación',
        text: 'Programas y espacios orientados al desarrollo de competencias de argumentación, análisis, expresión oral, refutación y pensamiento crítico.',
      },
      {
        label: 'Formación académica',
        text: 'Talleres, actividades y experiencias de aprendizaje vinculadas con la comunicación, la deliberación, la oratoria y el liderazgo.',
      },
      {
        label: 'Modelo de Naciones Unidas',
        text: 'Desarrollo de iniciativas académicas vinculadas al Modelo de Naciones Unidas, incluyendo conferencias, procesos formativos y experiencias de simulación a través de SoPeD MUN.',
      },
      {
        label: 'Liderazgo y ciudadanía',
        text: 'Iniciativas orientadas a fortalecer el liderazgo juvenil, la participación, el diálogo y la formación cívica.',
      },
      {
        label: 'Espacios de diálogo',
        text: 'Actividades y plataformas para la deliberación, el intercambio de ideas y el análisis de asuntos de interés académico y social.',
      },
    ],
  },
  {
    id: 'actividades',
    title: 'Actividades',
    items: [
      { label: 'Competencias y espacios de debate académico.' },
      { label: 'Talleres de argumentación, persuasión, oratoria y comunicación.' },
      { label: 'Procesos formativos para estudiantes y jóvenes.' },
      { label: 'Actividades relacionadas con el Modelo de Naciones Unidas.' },
      { label: 'Espacios de diálogo, deliberación y formación ciudadana.' },
    ],
  },
]

export default function InstitucionalPage() {
  return (
    <div className="inst-page">

      {/* ═══ HERO ═══ */}
      <section className="inst-hero">
        <div className="inst-hero__glow" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="inst-hero__eyebrow">
            <span className="deco-line" />
            <span>Sociedad Peruana de Debate</span>
          </div>
          <h1 className="inst-hero__h1">
            Transparencia<br />
            <em>y contenido</em>
          </h1>
          <p className="inst-hero__sub">
            La Sociedad Peruana de Debate – SoPeD es una asociación civil sin fines de lucro dedicada a promover el debate, la argumentación, el pensamiento crítico y la formación de liderazgo.
          </p>
        </div>
        <div className="inst-hero__border" aria-hidden="true" />
      </section>

      {/* ═══ IDENTIDAD ═══ */}
      <section className="inst-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">01</span>
            <h2 className="inst-section__title">Identidad institucional</h2>
          </div>

          <div className="inst-identity">
            <div className="inst-identity__row">
              <span className="inst-identity__label">Nombre oficial</span>
              <span className="inst-identity__value">SOCIEDAD PERUANA DE DEBATE</span>
            </div>
            <div className="inst-identity__row">
              <span className="inst-identity__label">Denominación institucional</span>
              <span className="inst-identity__value">SoPeD</span>
            </div>
            <div className="inst-identity__row">
              <span className="inst-identity__label">Naturaleza</span>
              <span className="inst-identity__value">Asociación civil sin fines de lucro</span>
            </div>
            <div className="inst-identity__row">
              <span className="inst-identity__label">Sitio web oficial</span>
              <span className="inst-identity__value">
                <a href="https://soped.pe" target="_blank" rel="noopener noreferrer">https://soped.pe</a>
              </span>
            </div>
            <div className="inst-identity__row">
              <span className="inst-identity__label">Dominio institucional</span>
              <span className="inst-identity__value">soped.pe</span>
            </div>
          </div>

          <p className="inst-statement">
            La Sociedad Peruana de Debate – SoPeD posee y opera el dominio <strong>soped.pe</strong>, el cual constituye su sitio web institucional oficial.
          </p>
        </div>
      </section>

      {/* ═══ REGISTRO ═══ */}
      <section className="inst-section inst-section--alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">02</span>
            <h2 className="inst-section__title">Registro e identificación</h2>
          </div>
          <p className="inst-text">
            Partida Electrónica SUNARP N.° 11368933
          </p>
        </div>
      </section>

      {/* ═══ DOMICILIO ═══ */}
      <section className="inst-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">03</span>
            <h2 className="inst-section__title">Domicilio institucional</h2>
          </div>
          <p className="inst-text">
            Urb. Entel Perú C-5, Wanchaq, Cusco, Perú.
          </p>
        </div>
      </section>

      {/* ═══ PROPÓSITO ═══ */}
      <section className="inst-section inst-section--alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">04</span>
            <h2 className="inst-section__title">Nuestro propósito</h2>
          </div>
          <div className="inst-prose">
            <p>
              La Sociedad Peruana de Debate promueve el debate académico, la argumentación rigurosa, el pensamiento crítico, la formación académica y el liderazgo cívico.
            </p>
            <p>
              Su propósito es generar espacios y oportunidades para que estudiantes y jóvenes desarrollen competencias de análisis, comunicación, deliberación, negociación y participación.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMAS ═══ */}
      <section className="inst-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">05</span>
            <h2 className="inst-section__title">{SECTIONS[0].title}</h2>
          </div>
          <div className="inst-programs">
            {SECTIONS[0].items.map((item) => (
              <div key={item.label} className="inst-program">
                <div className="inst-program__label">{item.label}</div>
                {'text' in item && item.text && (
                  <p className="inst-program__text">{item.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ACTIVIDADES ═══ */}
      <section className="inst-section inst-section--alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">06</span>
            <h2 className="inst-section__title">{SECTIONS[1].title}</h2>
          </div>
          <ul className="inst-activities">
            {SECTIONS[1].items.map((item) => (
              <li key={item.label} className="inst-activities__item">
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ PRESENCIA DIGITAL ═══ */}
      <section className="inst-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">07</span>
            <h2 className="inst-section__title">Presencia institucional</h2>
          </div>
          <div className="inst-prose">
            <p>
              La Sociedad Peruana de Debate – SoPeD desarrolla y comunica sus actividades institucionales a través de sus canales oficiales. El dominio <strong>soped.pe</strong> es operado por la organización y constituye su sitio web institucional oficial.
            </p>
            <p>
              Incluimos esta información con el propósito de facilitar la identificación y verificación de nuestra organización por parte de instituciones, aliados, entidades y servicios con los que desarrollamos procesos de vinculación institucional.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CONTACTO ═══ */}
      <section className="inst-section inst-section--alt inst-section--last">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="inst-contact">
            Para información institucional o procesos de vinculación, puede contactarse con la Sociedad Peruana de Debate a través de nuestros{' '}
            <a href="https://soped.pe/nosotros">canales institucionales</a>.
          </p>
        </div>
      </section>

    </div>
  )
}