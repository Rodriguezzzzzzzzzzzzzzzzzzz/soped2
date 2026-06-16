'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  User,
  Users,
  Building2,
  Landmark,
  GraduationCap,
  Globe,
  Shield,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  FileText,
  Award,
  BookOpen,
  Target,
} from 'lucide-react'

const STORAGE_KEY = 'soped_mun_registration_draft'

type RegistrationModalityId = 'individual' | 'small' | 'large' | 'institutional' | 'faculty'

const modalities = [
  {
    id: 'individual' as RegistrationModalityId,
    badge: 'Individual',
    icon: <User size={20} strokeWidth={1.5} />,
    title: 'Individual Delegate',
    description: 'Independent participation as an official delegate in one of the conference committees. No institutional affiliation required.',
    featured: false,
  },
  {
    id: 'small' as RegistrationModalityId,
    badge: 'Delegation',
    icon: <Users size={20} strokeWidth={1.5} />,
    title: 'Small Delegation',
    description: 'Institutional registration for reduced delegations. Includes joint coordination and priority committee access.',
    featured: false,
  },
  {
    id: 'large' as RegistrationModalityId,
    badge: 'Delegation',
    icon: <Building2 size={20} strokeWidth={1.5} />,
    title: 'Large Delegation',
    description: 'Full institutional registration for universities and organizations with expanded delegations and academic support.',
    featured: false,
  },
  {
    id: 'institutional' as RegistrationModalityId,
    badge: 'Official',
    icon: <Landmark size={20} strokeWidth={1.5} />,
    title: 'Institutional Delegation',
    description: 'Official registration for institutions formally represented within the conference. Full institutional recognition across all conference proceedings.',
    featured: true,
    label: 'Official Representation',
  },
  {
    id: 'faculty' as RegistrationModalityId,
    badge: 'Advisory',
    icon: <GraduationCap size={20} strokeWidth={1.5} />,
    title: 'Faculty Advisor',
    description: 'Registration for academic advisors and institutional representatives. Official accreditation and access to all conference sessions.',
    featured: false,
  },
]

const contextBlocks = [
  {
    icon: <Globe size={18} strokeWidth={1.5} />,
    title: 'Model United Nations',
    body: 'An academic simulation of United Nations proceedings, where delegates represent member states and engage in formal parliamentary debate on critical global issues.',
  },
  {
    icon: <BookOpen size={18} strokeWidth={1.5} />,
    title: 'SoPeD MUN Conference',
    body: 'Organized by the Sociedad Peruana de Debate, SoPeD MUN convenes students from across Latin America in a structured diplomatic environment governed by formal Rules of Procedure.',
  },
  {
    icon: <Award size={18} strokeWidth={1.5} />,
    title: 'Academic Value',
    body: 'Participants develop advanced argumentation, negotiation, and drafting skills. Recognized by academic institutions as a formative experience in international affairs and public policy.',
  },
  {
    icon: <Target size={18} strokeWidth={1.5} />,
    title: 'Formative Impact',
    body: 'SoPeD MUN produces delegates with verifiable competencies in multilateral diplomacy, position paper drafting, and consensus-building under formal institutional pressure.',
  },
]

export default function InscripcionPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    country: '',
    committee: '',
    motivation: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [lastSaved, setLastSaved] = useState('')
  const [selectedModality, setSelectedModality] = useState<RegistrationModalityId | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setForm(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      const t = new Date()
      setLastSaved(
        `Auto-saved · ${t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      )
    } catch {}
  }, [form])

  const update = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }))

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const isValid =
    form.name.trim() &&
    emailValid &&
    form.phone.trim() &&
    form.institution.trim() &&
    form.country.trim() &&
    form.committee.trim() &&
    form.motivation.trim()

  const submit = async () => {
    if (!isValid) return
    setLoading(true)
    try {
      const { error } = await supabase.from('mun_applications').insert([{
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        institution: form.institution,
        country: form.country,
        committee: form.committee,
        motivation: form.motivation,
      }])
      if (error) throw error
      localStorage.removeItem(STORAGE_KEY)
      setSuccess(true)
    } catch {
      alert('Submission error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .portal {
          min-height: 100vh;
          background: #0F0A0B;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #e8eaf0;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Ambient background ── */
        .portal__aurora {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 70% 45% at 15% 10%, rgba(200,0,48,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 85% 85%, rgba(236,229,214,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(200,0,48,0.03) 0%, transparent 70%);
        }

        /* ── Nav bar ── */
        .portal__nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          background: rgba(15,10,11,0.72);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.055);
        }
        .portal__nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .portal__nav-shield {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, rgba(236,229,214,0.15), rgba(236,229,214,0.06));
          border: 1px solid rgba(236,229,214,0.22);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(236,229,214,0.80);
        }
        .portal__nav-name {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.80);
        }
        .portal__nav-name span { color: rgba(236,229,214,0.72); }
        .portal__nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }
        .portal__nav-links a {
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.38);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .portal__nav-links a:hover { color: rgba(255,255,255,0.70); }
        .portal__nav-status {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: rgba(79,255,168,0.62);
          text-transform: uppercase;
        }
        .portal__nav-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(79,255,168,0.70);
          animation: statusPulse 2.4s ease-in-out infinite;
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.85); }
        }

        /* ── Main layout ── */
        .portal__main {
          position: relative;
          z-index: 1;
          padding-top: 64px;
        }

        /* ── Hero ── */
        .hero {
          padding: 120px 48px 96px;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 80px;
          align-items: center;
        }
        .hero__left {}
        .hero__official-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 10px;
          border-radius: 999px;
          background: rgba(236,229,214,0.06);
          border: 1px solid rgba(236,229,214,0.18);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(236,229,214,0.72);
          margin-bottom: 32px;
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        .hero__official-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(236,229,214,0.80);
        }
        .hero__title {
          font-size: clamp(2.8rem, 4.5vw, 4.2rem);
          font-weight: 700;
          line-height: 1.04;
          letter-spacing: -0.05em;
          color: #ffffff;
          margin-bottom: 10px;
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.18s both;
        }
        .hero__title-accent {
          background: linear-gradient(135deg, #ECE5D6 0%, #ECE5D6 50%, #ECE5D6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero__subtitle {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(200,0,48,0.68);
          margin-bottom: 28px;
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.24s both;
        }
        .hero__desc {
          font-size: 16px;
          line-height: 1.80;
          color: rgba(232,234,240,0.54);
          max-width: 540px;
          margin-bottom: 44px;
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.30s both;
        }
        .hero__actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.36s both;
        }
        .hero__btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 12px;
          background: linear-gradient(135deg, #A01028 0%, #C80030 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 650;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 8px 28px rgba(200,0,48,0.28);
          transition: transform 0.26s cubic-bezier(0.22,1,0.36,1), box-shadow 0.26s ease;
        }
        .hero__btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(200,0,48,0.38);
        }
        .hero__btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.62);
          font-size: 13.5px;
          font-weight: 550;
          letter-spacing: 0.02em;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease, transform 0.26s cubic-bezier(0.22,1,0.36,1);
        }
        .hero__btn-secondary:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.82);
          transform: translateY(-2px);
        }

        /* Hero right — credential card */
        .hero__credential {
          background: rgba(160,16,40,0.72);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
          animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.22s both;
        }
        .hero__credential-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .hero__credential-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(236,229,214,0.08);
          border: 1px solid rgba(236,229,214,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(236,229,214,0.75);
        }
        .hero__credential-title {
          font-size: 13px;
          font-weight: 650;
          color: rgba(255,255,255,0.82);
          letter-spacing: -0.01em;
        }
        .hero__credential-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.32);
          letter-spacing: 0.02em;
          margin-top: 2px;
        }
        .hero__credential-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hero__credential-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hero__credential-stat-label {
          font-size: 11.5px;
          color: rgba(255,255,255,0.36);
          letter-spacing: 0.04em;
        }
        .hero__credential-stat-value {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.70);
          letter-spacing: 0.02em;
        }
        .hero__credential-stat-value--gold {
          color: rgba(236,229,214,0.78);
        }
        .hero__credential-stat-value--green {
          color: rgba(79,255,168,0.68);
        }
        .hero__credential-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 4px 0;
        }
        .hero__credential-footer {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 10.5px;
          color: rgba(255,255,255,0.24);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-align: center;
        }

        /* ── Divider ── */
        .section-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── Context section ── */
        .context {
          padding: 96px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .context__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(200,0,48,0.62);
          margin-bottom: 18px;
        }
        .context__eyebrow-line {
          width: 28px; height: 1px;
          background: rgba(200,0,48,0.40);
        }
        .context__title {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #ffffff;
          margin-bottom: 14px;
          max-width: 520px;
          line-height: 1.12;
        }
        .context__intro {
          font-size: 15.5px;
          line-height: 1.78;
          color: rgba(232,234,240,0.48);
          max-width: 560px;
          margin-bottom: 56px;
        }
        .context__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .context__card {
          background: rgba(160,16,40,0.55);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px 24px;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition: border-color 0.26s ease, transform 0.26s cubic-bezier(0.22,1,0.36,1), box-shadow 0.26s ease;
          animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .context__card:nth-child(1) { animation-delay: 0.05s; }
        .context__card:nth-child(2) { animation-delay: 0.10s; }
        .context__card:nth-child(3) { animation-delay: 0.15s; }
        .context__card:nth-child(4) { animation-delay: 0.20s; }
        .context__card:hover {
          border-color: rgba(200,0,48,0.18);
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.22);
        }
        .context__card-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(200,0,48,0.07);
          border: 1px solid rgba(200,0,48,0.13);
          color: rgba(200,0,48,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .context__card-title {
          font-size: 14px;
          font-weight: 650;
          color: rgba(255,255,255,0.88);
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .context__card-body {
          font-size: 13.5px;
          line-height: 1.75;
          color: rgba(232,234,240,0.40);
        }

        /* ── Modalities ── */
        .modalities {
          padding: 96px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .modalities__header {
          margin-bottom: 52px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 32px;
          flex-wrap: wrap;
        }
        .modalities__header-left {}
        .modalities__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(236,229,214,0.58);
          margin-bottom: 16px;
        }
        .modalities__eyebrow-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(236,229,214,0.70);
        }
        .modalities__title {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .modalities__subtitle {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(232,234,240,0.42);
          max-width: 460px;
        }
        .modalities__header-note {
          font-size: 11.5px;
          color: rgba(255,255,255,0.24);
          letter-spacing: 0.06em;
          text-align: right;
          max-width: 200px;
          line-height: 1.65;
        }
        .modalities__top-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 14px;
          margin-bottom: 14px;
        }
        .modalities__featured-row {
          display: flex;
          justify-content: center;
        }
        .modalities__featured-wrapper {
          width: 100%;
          max-width: 700px;
        }

        /* Modality card */
        .mod-card {
          position: relative;
          background: rgba(36,16,20,0.62);
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 16px;
          padding: 26px 22px;
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.18);
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, border-color 0.28s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .mod-card:nth-child(1) { animation-delay: 0.05s; }
        .mod-card:nth-child(2) { animation-delay: 0.10s; }
        .mod-card:nth-child(3) { animation-delay: 0.15s; }
        .mod-card:nth-child(4) { animation-delay: 0.20s; }
        .mod-card:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(200,0,48,0.22);
          box-shadow: 0 16px 44px rgba(0,0,0,0.28);
        }
        .mod-card--featured {
          background: rgba(160,16,40,0.82);
          border-color: rgba(236,229,214,0.18);
          box-shadow:
            0 0 0 1px rgba(236,229,214,0.10),
            0 14px 44px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(236,229,214,0.06);
        }
        .mod-card--featured:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(236,229,214,0.32);
          box-shadow:
            0 0 0 1px rgba(236,229,214,0.16),
            0 22px 56px rgba(0,0,0,0.36),
            inset 0 1px 0 rgba(236,229,214,0.08);
        }
        .mod-card__glow {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(ellipse at top left, rgba(236,229,214,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .mod-card__official-tag {
          position: absolute;
          top: 16px; right: 16px;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(236,229,214,0.46);
        }
        .mod-card__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.40);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 18px;
          align-self: flex-start;
        }
        .mod-card__badge--gold {
          background: rgba(236,229,214,0.07);
          border-color: rgba(236,229,214,0.20);
          color: rgba(236,229,214,0.80);
        }
        .mod-card__badge-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(236,229,214,0.82);
        }
        .mod-card__icon {
          width: 42px; height: 42px;
          border-radius: 11px;
          background: rgba(200,0,48,0.07);
          border: 1px solid rgba(200,0,48,0.13);
          color: rgba(200,0,48,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          transition: background 0.22s ease;
        }
        .mod-card:hover .mod-card__icon { background: rgba(200,0,48,0.12); }
        .mod-card__icon--gold {
          background: rgba(236,229,214,0.07);
          border-color: rgba(236,229,214,0.16);
          color: rgba(236,229,214,0.78);
        }
        .mod-card--featured:hover .mod-card__icon--gold { background: rgba(236,229,214,0.12); }
        .mod-card__title {
          font-size: 15.5px;
          font-weight: 650;
          color: rgba(255,255,255,0.90);
          letter-spacing: -0.025em;
          line-height: 1.28;
          margin-bottom: 9px;
        }
        .mod-card--featured .mod-card__title {
          font-size: 17px;
          color: #ffffff;
        }
        .mod-card__desc {
          font-size: 13px;
          line-height: 1.72;
          color: rgba(232,234,240,0.36);
          flex-grow: 1;
          margin-bottom: 20px;
        }
        .mod-card__divider {
          height: 1px;
          background: rgba(255,255,255,0.055);
          margin-bottom: 15px;
        }
        .mod-card--featured .mod-card__divider { background: rgba(236,229,214,0.09); }
        .mod-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(200,0,48,0.70);
          letter-spacing: 0.01em;
          transition: gap 0.22s ease, color 0.22s ease;
        }
        .mod-card--featured .mod-card__cta { color: rgba(236,229,214,0.70); }
        .mod-card:hover .mod-card__cta { gap: 8px; color: rgba(200,0,48,0.90); }
        .mod-card--featured:hover .mod-card__cta { color: rgba(236,229,214,0.90); }

        /* selected state */
        .mod-card--selected {
          border-color: rgba(200,0,48,0.40) !important;
          box-shadow: 0 0 0 3px rgba(200,0,48,0.08), 0 16px 44px rgba(0,0,0,0.28) !important;
        }
        .mod-card--featured.mod-card--selected {
          border-color: rgba(236,229,214,0.44) !important;
          box-shadow: 0 0 0 3px rgba(236,229,214,0.08), 0 16px 44px rgba(0,0,0,0.28) !important;
        }

        /* ── Form section ── */
        .form-section {
          padding: 96px 48px 120px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .form-section__header {
          margin-bottom: 48px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: flex-start;
          gap: 32px;
        }
        .form-section__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(200,0,48,0.60);
          margin-bottom: 16px;
        }
        .form-section__eyebrow-line {
          width: 28px; height: 1px;
          background: rgba(200,0,48,0.38);
        }
        .form-section__title {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .form-section__subtitle {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(232,234,240,0.42);
          max-width: 480px;
        }
        .form-section__doc-id {
          text-align: right;
          font-size: 10.5px;
          color: rgba(255,255,255,0.20);
          letter-spacing: 0.08em;
          line-height: 1.8;
          font-variant-numeric: tabular-nums;
        }

        /* Form card */
        .form-card {
          background: rgba(36,16,20,0.68);
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 22px;
          backdrop-filter: blur(26px);
          -webkit-backdrop-filter: blur(26px);
          box-shadow: 0 16px 64px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04);
          overflow: hidden;
        }
        .form-card__top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 36px;
          background: rgba(255,255,255,0.022);
          border-bottom: 1px solid rgba(255,255,255,0.055);
        }
        .form-card__top-bar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .form-card__top-bar-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(200,0,48,0.09);
          border: 1px solid rgba(200,0,48,0.16);
          color: rgba(200,0,48,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .form-card__top-bar-title {
          font-size: 13px;
          font-weight: 650;
          color: rgba(255,255,255,0.75);
          letter-spacing: -0.01em;
        }
        .form-card__top-bar-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.02em;
        }
        .form-card__saved {
          font-size: 11px;
          color: rgba(255,255,255,0.26);
          letter-spacing: 0.04em;
        }
        .form-card__body {
          padding: 40px 36px;
        }

        /* Field groups */
        .field-group {
          margin-bottom: 36px;
        }
        .field-group__label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.24);
          margin-bottom: 18px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .field-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .field__label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.52);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .field__required {
          color: rgba(236,229,214,0.55);
          font-size: 10px;
        }
        .field__input {
          width: 100%;
          padding: 13px 15px;
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          font-size: 14px;
          color: rgba(255,255,255,0.88);
          outline: none;
          transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          font-family: inherit;
          -webkit-appearance: none;
        }
        .field__input::placeholder { color: rgba(255,255,255,0.18); }
        .field__input:focus {
          border-color: rgba(200,0,48,0.42);
          background: rgba(200,0,48,0.036);
          box-shadow: 0 0 0 3px rgba(200,0,48,0.07);
        }
        .field__input--error {
          border-color: rgba(200,0,48,0.4) !important;
        }
        .field__input--error:focus {
          box-shadow: 0 0 0 3px rgba(200,0,48,0.12) !important;
          background: rgba(200,0,48,0.04) !important;
        }
        .field__error {
          font-size: 11px;
          color: rgba(200,0,48,0.8);
          letter-spacing: 0.01em;
        }
        .field__textarea {
          width: 100%;
          min-height: 140px;
          padding: 14px 15px;
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          font-size: 14px;
          color: rgba(255,255,255,0.88);
          outline: none;
          resize: vertical;
          line-height: 1.76;
          font-family: inherit;
          transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
        }
        .field__textarea::placeholder { color: rgba(255,255,255,0.18); }
        .field__textarea:focus {
          border-color: rgba(200,0,48,0.42);
          background: rgba(200,0,48,0.036);
          box-shadow: 0 0 0 3px rgba(200,0,48,0.07);
        }

        /* Form footer */
        .form-card__footer {
          padding: 28px 36px 36px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .form-card__footer-note {
          font-size: 11.5px;
          color: rgba(255,255,255,0.22);
          line-height: 1.65;
          max-width: 380px;
        }
        .form-card__footer-note a {
          color: rgba(200,0,48,0.55);
          text-decoration: none;
        }
        .form-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 15px 30px;
          border-radius: 12px;
          background: linear-gradient(135deg, #A01028 0%, #C80030 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 650;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(200,0,48,0.26);
          transition: opacity 0.22s ease, transform 0.24s cubic-bezier(0.22,1,0.36,1), box-shadow 0.24s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        .form-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(200,0,48,0.36);
        }
        .form-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .form-submit-btn:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }

        /* ── Success state ── */
        .success-portal {
          min-height: 100vh;
          background: #0F0A0B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', -apple-system, sans-serif;
          padding: 48px 24px;
        }
        .success-card {
          background: rgba(36,16,20,0.72);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px;
          padding: 56px 48px;
          text-align: center;
          max-width: 480px;
          width: 100%;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 20px 64px rgba(0,0,0,0.35);
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        .success-card__icon {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: rgba(79,255,168,0.07);
          border: 1px solid rgba(79,255,168,0.16);
          color: rgba(79,255,168,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
        }
        .success-card__eyebrow {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(79,255,168,0.55);
          margin-bottom: 14px;
        }
        .success-card__title {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #ffffff;
          margin-bottom: 14px;
          line-height: 1.15;
        }
        .success-card__body {
          font-size: 14.5px;
          line-height: 1.78;
          color: rgba(232,234,240,0.44);
          max-width: 360px;
          margin: 0 auto 36px;
        }
        .success-card__ref {
          font-size: 11px;
          color: rgba(255,255,255,0.20);
          letter-spacing: 0.08em;
          padding: 12px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          display: inline-block;
        }

        /* ── Keyframes ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .hero { grid-template-columns: 1fr; gap: 48px; padding: 100px 32px 72px; }
          .hero__credential { max-width: 420px; }
          .context { padding: 72px 32px; }
          .modalities { padding: 72px 32px; }
          .form-section { padding: 72px 32px 96px; }
          .portal__nav { padding: 0 24px; }
          .portal__nav-links { display: none; }
        }
        @media (max-width: 640px) {
          .hero { padding: 88px 20px 60px; }
          .context { padding: 56px 20px; }
          .modalities { padding: 56px 20px; }
          .form-section { padding: 56px 20px 80px; }
          .modalities__top-grid { grid-template-columns: 1fr; }
          .form-card__body { padding: 28px 20px; }
          .form-card__top-bar { padding: 16px 20px; }
          .form-card__footer { padding: 22px 20px 28px; flex-direction: column; align-items: stretch; }
          .form-submit-btn { width: 100%; justify-content: center; }
          .form-section__header { grid-template-columns: 1fr; }
          .form-section__doc-id { text-align: left; }
          .hero__actions { flex-direction: column; }
          .hero__btn-primary, .hero__btn-secondary { justify-content: center; }
        }
      `}</style>

      {success ? (
        <div className="success-portal">
          <div className="success-card">
            <div className="success-card__icon">
              <CheckCircle2 size={30} strokeWidth={1.5} />
            </div>
            <div className="success-card__eyebrow">Submission Received</div>
            <h2 className="success-card__title">Application Successfully Submitted</h2>
            <p className="success-card__body">
              Your registration has been received by the SoPeD MUN Secretariat.
              The academic team will review your application and contact you via email.
            </p>
            <div className="success-card__ref" suppressHydrationWarning>
              REF · SOPED-MUN · {new Date().getFullYear()}
            </div>
          </div>
        </div>
      ) : (
        <div className="portal">
          <div className="portal__aurora" />

          {/* ── Nav ── */}
          <nav className="portal__nav">
            <a href="/" className="portal__nav-brand">
              <div className="portal__nav-shield">
                <Shield size={14} strokeWidth={1.5} />
              </div>
              <div>
                <div className="portal__nav-name">SoPeD <span>MUN</span></div>
              </div>
            </a>
            <ul className="portal__nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/mun">Conference</a></li>
              <li><a href="/debate-escolar">Debate</a></li>
              <li><a href="/contacto">Contact</a></li>
            </ul>
            <div className="portal__nav-status">
              <div className="portal__nav-status-dot" />
              Portal Active
            </div>
          </nav>

          <main className="portal__main">

            {/* ── Hero ── */}
            <section className="hero">
              <div className="hero__left">
                <div className="hero__official-badge">
                  <div className="hero__official-badge-dot" />
                  Official Registration Portal
                </div>
                <h1 className="hero__title">
                  SoPeD <span className="hero__title-accent">MUN</span><br />
                  Registration
                </h1>
                <div className="hero__subtitle">
                  International Academic Conference · Lima, Peru
                </div>
                <p className="hero__desc">
                  The official delegate registration system for the Sociedad Peruana de Debate
                  Model United Nations Conference. Complete your application to participate
                  in formal diplomatic proceedings.
                </p>
                <div className="hero__actions">
                  <a href="#form" className="hero__btn-primary">
                    Begin Registration
                    <ArrowRight size={15} strokeWidth={2} />
                  </a>
                  <a href="#about" className="hero__btn-secondary">
                    <FileText size={15} strokeWidth={1.5} />
                    Conference Overview
                  </a>
                </div>
              </div>
              <div className="hero__credential">
                <div className="hero__credential-header">
                  <div className="hero__credential-icon">
                    <Shield size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="hero__credential-title">Conference Details</div>
                    <div className="hero__credential-sub">SoPeD MUN · Official Portal</div>
                  </div>
                </div>
                <div className="hero__credential-stats">
                  <div className="hero__credential-stat">
                    <span className="hero__credential-stat-label">Conference Status</span>
                    <span className="hero__credential-stat-value hero__credential-stat-value--green">Open</span>
                  </div>
                  <div className="hero__credential-divider" />
                  <div className="hero__credential-stat">
                    <span className="hero__credential-stat-label">Registration Type</span>
                    <span className="hero__credential-stat-value">Open Enrollment</span>
                  </div>
                  <div className="hero__credential-divider" />
                  <div className="hero__credential-stat">
                    <span className="hero__credential-stat-label">Language</span>
                    <span className="hero__credential-stat-value">Spanish / English</span>
                  </div>
                  <div className="hero__credential-divider" />
                  <div className="hero__credential-stat">
                    <span className="hero__credential-stat-label">Organized by</span>
                    <span className="hero__credential-stat-value hero__credential-stat-value--gold">SoPeD</span>
                  </div>
                  <div className="hero__credential-divider" />
                  <div className="hero__credential-stat">
                    <span className="hero__credential-stat-label">Level</span>
                    <span className="hero__credential-stat-value">International</span>
                  </div>
                </div>
                <div className="hero__credential-footer">
                  Sociedad Peruana de Debate · Official Conference System
                </div>
              </div>
            </section>

            <div className="section-divider" />

            {/* ── Context ── */}
            <section className="context" id="about">
              <div className="context__eyebrow">
                <div className="context__eyebrow-line" />
                Conference Documentation
              </div>
              <h2 className="context__title">About SoPeD MUN</h2>
              <p className="context__intro">
                An institutional-grade academic simulation of United Nations proceedings,
                designed to develop advanced competencies in diplomacy, negotiation,
                and international public policy.
              </p>
              <div className="context__grid">
                {contextBlocks.map((block, i) => (
                  <div key={i} className="context__card">
                    <div className="context__card-icon">{block.icon}</div>
                    <h3 className="context__card-title">{block.title}</h3>
                    <p className="context__card-body">{block.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="section-divider" />

            {/* ── Modalities ── */}
            <section className="modalities">
              <div className="modalities__header">
                <div className="modalities__header-left">
                  <div className="modalities__eyebrow">
                    <div className="modalities__eyebrow-dot" />
                    Registration Modalities
                  </div>
                  <h2 className="modalities__title">Select Your Category</h2>
                  <p className="modalities__subtitle">
                    Choose the modality that best represents your form of
                    participation in the conference proceedings.
                  </p>
                </div>
                <div className="modalities__header-note">
                  All registrations are subject to review by the SoPeD MUN Secretariat
                </div>
              </div>

              <div className="modalities__top-grid">
                {modalities.filter(m => !m.featured).map((item) => (
                  <div
                    key={item.id}
                    className={`mod-card${selectedModality === item.id ? ' mod-card--selected' : ''}`}
                    onClick={() => setSelectedModality(item.id)}
                  >
                    <div className={`mod-card__badge`}>{item.badge}</div>
                    <div className="mod-card__icon">{item.icon}</div>
                    <h3 className="mod-card__title">{item.title}</h3>
                    <p className="mod-card__desc">{item.description}</p>
                    <div className="mod-card__divider" />
                    <div className="mod-card__cta">
                      <span>Select</span>
                      <ChevronRight size={13} strokeWidth={2} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="modalities__featured-row">
                <div className="modalities__featured-wrapper">
                  {modalities.filter(m => m.featured).map((item) => (
                    <div
                      key={item.id}
                      className={`mod-card mod-card--featured${selectedModality === item.id ? ' mod-card--selected' : ''}`}
                      onClick={() => setSelectedModality(item.id)}
                    >
                      <div className="mod-card__glow" />
                      {item.label && (
                        <div className="mod-card__official-tag">{item.label}</div>
                      )}
                      <div className="mod-card__badge mod-card__badge--gold">
                        <div className="mod-card__badge-dot" />
                        {item.badge}
                      </div>
                      <div className="mod-card__icon mod-card__icon--gold">{item.icon}</div>
                      <h3 className="mod-card__title">{item.title}</h3>
                      <p className="mod-card__desc">{item.description}</p>
                      <div className="mod-card__divider" />
                      <div className="mod-card__cta">
                        <span>Select this modality</span>
                        <ChevronRight size={13} strokeWidth={2} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="section-divider" />

            {/* ── Form ── */}
            <section className="form-section" id="form">
              <div className="form-section__header">
                <div>
                  <div className="form-section__eyebrow">
                    <div className="form-section__eyebrow-line" />
                    Official Application
                  </div>
                  <h2 className="form-section__title">Delegate Registration Form</h2>
                  <p className="form-section__subtitle">
                    Complete all required fields. Your application will be reviewed
                    by the SoPeD MUN academic committee.
                  </p>
                </div>
                <div className="form-section__doc-id" suppressHydrationWarning>
                  FORM · REG-MUN-01<br />
                  {new Date().getFullYear()} · Official System
                </div>
              </div>

              <div className="form-card">
                <div className="form-card__top-bar">
                  <div className="form-card__top-bar-left">
                    <div className="form-card__top-bar-icon">
                      <FileText size={14} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="form-card__top-bar-title">Official Registration Submission</div>
                      <div className="form-card__top-bar-sub">SoPeD MUN · Secretariat System</div>
                    </div>
                  </div>
                  <div className="form-card__saved" suppressHydrationWarning>
                    {lastSaved}
                  </div>
                </div>

                <div className="form-card__body">

                  {/* Personal info */}
                  <div className="field-group">
                    <div className="field-group__label">Personal Information</div>
                    <div className="field-grid">
                      <div className="field">
                        <label className="field__label" htmlFor="name">
                          Full Name <span className="field__required">*</span>
                        </label>
                        <input
                          id="name"
                          className="field__input"
                          value={form.name}
                          onChange={e => update('name', e.target.value)}
                          placeholder="As it appears on your ID"
                          autoComplete="name"
                        />
                      </div>
                      <div className="field">
                        <label className="field__label" htmlFor="email">
                          Email Address <span className="field__required">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          className={`field__input${!emailValid && emailTouched ? ' field__input--error' : ''}`}
                          value={form.email}
                          onChange={e => { setEmailTouched(true); update('email', e.target.value) }}
                          placeholder="official@institution.edu"
                          autoComplete="email"
                        />
                        {!emailValid && emailTouched && (
                          <span className="field__error">Enter a valid email address</span>
                        )}
                      </div>
                      <div className="field">
                        <label className="field__label" htmlFor="phone">
                          Phone Number <span className="field__required">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className="field__input"
                          value={form.phone}
                          onChange={e => update('phone', e.target.value)}
                          placeholder="+51 999 000 000"
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Institutional info */}
                  <div className="field-group">
                    <div className="field-group__label">Institutional Information</div>
                    <div className="field-grid">
                      <div className="field">
                        <label className="field__label" htmlFor="institution">
                          Institution <span className="field__required">*</span>
                        </label>
                        <input
                          id="institution"
                          className="field__input"
                          value={form.institution}
                          onChange={e => update('institution', e.target.value)}
                          placeholder="School or university name"
                          autoComplete="organization"
                        />
                      </div>
                      <div className="field">
                        <label className="field__label" htmlFor="country">
                          Country <span className="field__required">*</span>
                        </label>
                        <input
                          id="country"
                          className="field__input"
                          value={form.country}
                          onChange={e => update('country', e.target.value)}
                          placeholder="Peru"
                          autoComplete="country-name"
                        />
                      </div>
                      <div className="field">
                        <label className="field__label" htmlFor="committee">
                          Committee Preference <span className="field__required">*</span>
                        </label>
                        <input
                          id="committee"
                          className="field__input"
                          value={form.committee}
                          onChange={e => update('committee', e.target.value)}
                          placeholder="UNSC, DISEC, ECOSOC..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <div className="field-group__label">Statement of Motivation</div>
                    <div className="field">
                      <label className="field__label" htmlFor="motivation">
                        Motivation Letter <span className="field__required">*</span>
                      </label>
                      <textarea
                        id="motivation"
                        className="field__textarea"
                        value={form.motivation}
                        onChange={e => update('motivation', e.target.value)}
                        placeholder="Describe your motivation for participating in SoPeD MUN and what you aim to contribute to the conference."
                      />
                    </div>
                  </div>

                </div>

                <div className="form-card__footer">
                  <p className="form-card__footer-note">
                    By submitting this form you agree to SoPeD's{' '}
                    <a href="#">terms of participation</a>. Your data will be
                    processed solely for conference administration purposes.
                  </p>
                  <button
                    onClick={submit}
                    disabled={!isValid || loading}
                    className="form-submit-btn"
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                    {!loading && <ArrowRight size={15} strokeWidth={2} />}
                  </button>
                </div>
              </div>
            </section>

          </main>
        </div>
      )}
    </>
  )
}