'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/nosotros/RevealOnScroll'

const teamMembers = [
  {
    name: 'Rodrigo Manuel Rodriguez',
    role: 'Presidente Nacional',
    initials: 'RR',
    image: '/RODRIGO.JPEG',
    bio: 'Especialista y mentor en debate, negociación y liderazgo, con más de cuatro años de experiencia. Especialista en Modelos de Naciones Unidas (MUN) y fundador de diversas organizaciones y clubes de debate en colegios y universidades.',
    specialties: ['Liderazgo institucional', 'Negociación', 'Debate parlamentario', 'Dirección estratégica'],
    trajectory: 'Fundador de múltiples organizaciones de debate. Ha liderado delegaciones en conferencias nacionales e internacionales, formando a más de 500 estudiantes en argumentación y diplomacia.',
    social: [
      { platform: 'LinkedIn', url: '#' },
      { platform: 'Email', url: 'mailto:rodrigo@soped.pe' },
    ],
    gradient: 'linear-gradient(135deg, #A01028 0%, #1C0408 100%)',
    accent: '#A01028',
  },
  {
    name: 'Lucero Beys Romero',
    role: 'Directora Académica',
    initials: 'LB',
    image: '/LUCERO.png',
    bio: 'Especialista en Derecho Internacional y ODS, representante en foros de Latinoamérica y el Caribe. Con experiencia en políticas públicas y diplomacia multilateral.',
    specialties: ['Derecho Internacional', 'ODS', 'Política exterior', 'Diplomacia multilateral'],
    trajectory: 'Representante peruana en foros internacionales de juventud y desarrollo sostenible. Ha trabajado con organismos multilaterales en la promoción de la agenda 2030.',
    social: [
      { platform: 'LinkedIn', url: '#' },
      { platform: 'Email', url: 'mailto:lucero@soped.pe' },
    ],
    gradient: 'linear-gradient(135deg, #C80030 0%, #2A050E 100%)',
    accent: '#C80030',
  },
  {
    name: 'Pedro Adrian Villalba',
    role: 'Coordinador MUN',
    initials: 'PV',
    image: '/PEDRO.jpeg',
    bio: 'Estudiante de Derecho con participación destacada en más de 10 conferencias jurídicas internacionales. Experto en procedimiento parlamentario y reglas de MUN.',
    specialties: ['Derecho internacional', 'Procedimiento parlamentario', 'MUN avanzado', 'Argumentación jurídica'],
    trajectory: 'Ha presidido comités en conferencias MUN a nivel nacional. Reconocido por su excelencia en la dirección de debates y formación de nuevos delegados.',
    social: [
      { platform: 'LinkedIn', url: '#' },
      { platform: 'Email', url: 'mailto:pedro@soped.pe' },
    ],
    gradient: 'linear-gradient(135deg, #8B0E22 0%, #1C0408 100%)',
    accent: '#8B0E22',
  },
  {
    name: 'Mateo Landaveri',
    role: 'Coordinador Escolar',
    initials: 'ML',
    image: '/MATEO.jpeg',
    bio: 'Educador con enfoque en el desarrollo del pensamiento crítico en adolescentes. Especialista en metodologías de enseñanza del debate en entornos escolares.',
    specialties: ['Pedagogía crítica', 'Debate escolar', 'Desarrollo curricular', 'Pensamiento crítico'],
    trajectory: 'Ha implementado programas de debate en más de 15 colegios a nivel nacional. Su metodología ha sido adoptada como referencia para la enseñanza de argumentación en secundaria.',
    social: [
      { platform: 'LinkedIn', url: '#' },
      { platform: 'Email', url: 'mailto:mateo@soped.pe' },
    ],
    gradient: 'linear-gradient(135deg, #A01028 0%, #1A0A0D 100%)',
    accent: '#A01028',
  },
  {
    name: 'Andre Mateo Nicolas Flores Alvarado',
    role: 'Director de Operaciones',
    initials: 'AF',
    image: '/ANDRE.png',
    bio: 'Estudiante de Medicina especialista en Modelos de Naciones Unidas. Ha participado en conferencias internacionales de liderazgo y gestión de equipos multidisciplinarios.',
    specialties: ['Operaciones', 'Logística de eventos', 'Liderazgo de equipos', 'Gestión MUN'],
    trajectory: 'Organizador principal de conferencias MUN con más de 300 participantes. Experto en planificación estratégica y gestión operativa de eventos académicos.',
    social: [
      { platform: 'LinkedIn', url: '#' },
      { platform: 'Email', url: 'mailto:andre@soped.pe' },
    ],
    gradient: 'linear-gradient(135deg, #C80030 0%, #0D0204 100%)',
    accent: '#C80030',
  },
]

function TeamMemberPhoto({
  initials,
  gradient,
  accent,
  image,
}: {
  initials: string
  gradient: string
  accent: string
  image?: string | null
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4/5',
        borderRadius: '12px',
        overflow: 'hidden',
        background: gradient,
        boxShadow: hovered
          ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(236,229,214,0.12), 0 0 60px ${accent}22`
          : '0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
        transform: hovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {image ? (
        <img
          src={image}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-20%',
              width: '60%',
              height: '60%',
              background: `radial-gradient(circle, ${accent}44 0%, transparent 70%)`,
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
              opacity: hovered ? 0.6 : 1,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', width: '32px', height: '2px', background: 'rgba(236,229,214,0.3)' }} />
          <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', width: '2px', height: '32px', background: 'rgba(236,229,214,0.3)' }} />
          <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '32px', height: '2px', background: 'rgba(236,229,214,0.2)' }} />
          <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '32px', height: '2px', background: 'rgba(236,229,214,0.2)' }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(4rem, 10vw, 7rem)',
                fontWeight: 600,
                color: 'rgba(236,229,214,0.5)',
                letterSpacing: '0.08em',
                lineHeight: 1,
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              }}
            >
              {initials}
            </span>
            <div
              style={{
                width: hovered ? '60px' : '40px',
                height: '1px',
                background: `linear-gradient(90deg, transparent, rgba(236,229,214,0.3), transparent)`,
                transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to top, rgba(28,4,8,0.3) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </div>
  )
}

function TeamMemberInfo({
  member,
  index,
}: {
  member: (typeof teamMembers)[0]
  index: number
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <span
        style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '0.6rem',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: member.accent,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 500,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
          }}
        >
          {member.name}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '24px', height: '1px', background: member.accent }} />
          <span
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(236,229,214,0.7)',
            }}
          >
            {member.role}
          </span>
        </div>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '0.95rem',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.85,
          maxWidth: '520px',
        }}
      >
        {member.bio}
      </p>
      <div>
        <span
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(236,229,214,0.35)',
            marginBottom: '0.75rem',
            display: 'block',
          }}
        >
          Especialidades
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {member.specialties.map((s) => (
            <span
              key={s}
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.72rem',
                color: 'rgba(236,229,214,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '0.3rem 0.75rem',
                letterSpacing: '0.04em',
                borderRadius: '2px',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${member.accent}55`
                e.currentTarget.style.color = 'rgba(236,229,214,0.8)'
                e.currentTarget.style.background = `${member.accent}11`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.color = 'rgba(236,229,214,0.5)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      {member.trajectory && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(255,255,255,0.02)',
            borderLeft: `2px solid ${member.accent}44`,
            borderRadius: '2px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '0.95rem',
              color: 'rgba(236,229,214,0.5)',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            "{member.trajectory}"
          </p>
        </div>
      )}
      {member.social && member.social.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
          {member.social.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.72rem',
                color: 'rgba(236,229,214,0.3)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'color 0.25s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '2px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(236,229,214,0.8)'
                e.currentTarget.style.borderColor = `${member.accent}44`
                e.currentTarget.style.background = `${member.accent}11`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(236,229,214,0.3)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {s.platform}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l10-10" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function TeamSection({
  member,
  index,
}: {
  member: (typeof teamMembers)[0]
  index: number
}) {
  const photoOnRight = index % 2 === 0
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      style={{
        padding: isMobile ? '4rem 0' : '7rem 0',
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: photoOnRight ? '10%' : '60%',
          left: photoOnRight ? '-8%' : 'auto',
          right: photoOnRight ? 'auto' : '-8%',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, ${member.accent}12 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: isMobile ? '0 1.25rem' : '0 3rem',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? '2.5rem' : '6rem',
        }}
      >
        <div
          style={{
            flex: isMobile ? 'none' : (photoOnRight ? '0 0 40%' : '0 0 42%'),
            maxWidth: isMobile ? '100%' : (photoOnRight ? '40%' : '42%'),
            order: isMobile ? 1 : (photoOnRight ? 2 : 1),
          }}
        >
          <TeamMemberPhoto initials={member.initials} gradient={member.gradient} accent={member.accent} image={member.image} />
        </div>
        <div
          style={{
            flex: isMobile ? 'none' : (photoOnRight ? '0 0 calc(60% - 6rem)' : '0 0 calc(58% - 6rem)'),
            maxWidth: isMobile ? '100%' : (photoOnRight ? 'calc(60% - 6rem)' : 'calc(58% - 6rem)'),
            order: isMobile ? 2 : (photoOnRight ? 1 : 2),
          }}
        >
          <TeamMemberInfo member={member} index={index} />
        </div>
      </div>
    </section>
  )
}

export default function TeamDirectivo() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <RevealOnScroll direction="up">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '4rem',
            maxWidth: '1280px',
            margin: '0 auto 4rem',
            padding: '0 3rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span className="deco-line" />
              <span
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(236,229,214,0.7)',
                }}
              >
                Las personas detrás
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                fontWeight: 400,
                color: '#fff',
                lineHeight: 1.1,
              }}
            >
              Equipo directivo
            </h2>
          </div>
          <Link href="/inscripcion" className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.78rem' }}>
            Únete al equipo →
          </Link>
        </div>
      </RevealOnScroll>

      <div>
        {teamMembers.map((member, i) => (
          <div key={member.name}>
            <TeamSection member={member} index={i} />
            {i < teamMembers.length - 1 && (
              <div
                style={{
                  maxWidth: 'calc(100% - 6rem)',
                  margin: '0 auto',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
