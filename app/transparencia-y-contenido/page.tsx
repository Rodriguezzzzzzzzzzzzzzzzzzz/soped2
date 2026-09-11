import type { Metadata } from 'next'
import './transparencia.css'

export const metadata: Metadata = {
  title: 'Transparencia y Contenido | Sociedad Peruana de Debate – SoPeD',
  description:
    'Información institucional y de verificación de la Sociedad Peruana de Debate – SoPeD: asociación civil sin fines de lucro registrada en SUNARP (Partida Electrónica N.° 11368933), con domicilio en Wánchaq, Cusco. Misión, programas y servicios de debate, argumentación y pensamiento crítico.',
}

const SECTIONS = [
  {
    id: 'programas',
    title: 'Programas y servicios',
    items: [
      {
        label: 'Debate académico y debate escolar',
        text: 'Competencias y espacios de debate académico, incluido el programa de debate escolar, orientados al desarrollo de la argumentación, el análisis, la refutación y la expresión oral.',
      },
      {
        label: 'Formación en debate y pensamiento crítico',
        text: 'Talleres y experiencias de aprendizaje sobre argumentación, pensamiento crítico, deliberación, oratoria y comunicación.',
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
        label: 'Espacios de diálogo y deliberación',
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

      {/* ═══ INFORMACIÓN INSTITUCIONAL ═══ */}
      <section className="inst-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">01</span>
            <h2 className="inst-section__title">Información institucional</h2>
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
              <span className="inst-identity__label">Naturaleza jurídica</span>
              <span className="inst-identity__value">Asociación civil sin fines de lucro</span>
            </div>
            <div className="inst-identity__row">
              <span className="inst-identity__label">Registro oficial</span>
              <span className="inst-identity__value">Partida Electrónica SUNARP N.° 11368933</span>
            </div>
            <div className="inst-identity__row">
              <span className="inst-identity__label">Identificador de organización</span>
              <span className="inst-identity__value">11368933</span>
            </div>
            <div className="inst-identity__row">
              <span className="inst-identity__label">Domicilio institucional registrado</span>
              <span className="inst-identity__value">Urb. Entel Perú C-5, distrito de Wánchaq, provincia de Cusco, departamento de Cusco, Perú.</span>
            </div>
            <div className="inst-identity__row">
              <span className="inst-identity__label">Titularidad y operación del dominio</span>
              <span className="inst-identity__value">Sociedad Peruana de Debate – SoPeD</span>
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
            La Sociedad Peruana de Debate – SoPeD posee, administra y opera el dominio <strong>soped.pe</strong>. Este dominio constituye el sitio web institucional oficial de la organización y es utilizado para comunicar sus actividades, programas, servicios e información institucional.
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
          <div className="inst-statement" style={{ marginTop: 0 }}>
            <p>
              ID registrado de la organización: <strong>11368933</strong><br />
              Partida Electrónica SUNARP N.° <strong>11368933</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ MISIÓN Y FINALIDAD ═══ */}
      <section className="inst-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">03</span>
            <h2 className="inst-section__title">Misión y finalidad</h2>
          </div>
          <div className="inst-prose">
            <p>
              Nuestra misión es promover el debate académico, la argumentación rigurosa, el pensamiento crítico, la formación educativa y el liderazgo cívico, generando espacios y oportunidades para que estudiantes y jóvenes desarrollen competencias de análisis, comunicación, deliberación, negociación y participación.
            </p>
            <p>
              La finalidad de la asociación es contribuir a la deliberación informada y a la participación ciudadana, fortaleciendo las capacidades que permitan analizar asuntos de interés público y expresar ideas con responsabilidad y rigor.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMAS Y SERVICIOS ═══ */}
      <section className="inst-section inst-section--alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">04</span>
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
      <section className="inst-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">05</span>
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

      {/* ═══ PRESENCIA INSTITUCIONAL ═══ */}
      <section className="inst-section inst-section--alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inst-section__header">
            <span className="inst-section__num">06</span>
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
      <section className="inst-section inst-section--last">
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