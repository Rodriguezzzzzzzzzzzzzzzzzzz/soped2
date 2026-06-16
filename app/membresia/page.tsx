'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MembresiaPage() {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || '0';
            setTimeout(() => {
              entry.target.classList.add('in-view');
            }, parseInt(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    const els = document.querySelectorAll('.fade-up, .fade-up-3d');
    els.forEach((el) => observer.observe(el));

    (window as any).__membershipObserver = observer;
    return () => {
      observer.disconnect();
      delete (window as any).__membershipObserver;
    };
  }, []);

  return (
    <>
      {/*
        Show blank screen until mounted, to avoid hydration mismatch
      */}
      {(() => {
        if (!mounted) {
          return (
            <div style={{
              background: '#080405',
              height: '100vh',
              width: '100%',
            }} />
          );
        }
      })()}
      <style jsx global>{`

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --surface-0: #080405;
          --surface-1: #100608;
          --surface-2: #1A090D;
          --surface-3: #240D12;
          --primary: #F0E7D5;
          --primary-bright: #F8F4EA;
          --primary-dim: rgba(240, 231, 213, 0.10);
          --primary-border: rgba(240, 231, 213, 0.18);
          --text-heading: rgba(255,255,255,0.95);
          --text-primary: rgba(255,255,255,0.86);
          --text-secondary: rgba(255,255,255,0.48);
          --text-muted: rgba(255,255,255,0.24);
          --glass-bg: rgba(240, 231, 213, 0.035);
          --glass-border: rgba(240, 231, 213, 0.08);
          --glass-hover: rgba(240, 231, 213, 0.09);
          --shadow-deep: 0 32px 80px rgba(0, 0, 0, 0.65);
          --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.45);
          --shadow-glow: 0 8px 32px rgba(240, 231, 213, 0.06);
          --red: #A01028;
          --red-bright: #A80028;
          --red-dim: rgba(124, 1, 26, 0.10);
          --red-glow: rgba(124, 1, 26, 0.30);
          --red-mist: rgba(124, 1, 26, 0.05);
          --font-display: "Cormorant Garamond", Georgia, serif;
          --font-body: "DM Sans", system-ui, sans-serif;
          --transition: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        html { scroll-behavior: smooth; }

        body {
          background: transparent;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-weight: 300;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── PAGE LOAD ANIMATION ── */
        .page-wrapper {
          opacity: 0;
          animation: pageFadeIn 0.6s ease forwards;
        }

        .page-wrapper.visible {
          opacity: 1;
        }

        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          opacity: 0.65;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 60% 40% at 20% 0%, rgba(124, 1, 26, 0.20) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 15%, rgba(124, 1, 26, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(8, 4, 5, 0.85) 0%, transparent 70%),
            linear-gradient(180deg, rgba(8,4,5,0.1) 0%, rgba(8,4,5,0.05) 40%, rgba(8,4,5,0.8) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 860px;
          padding: 0 2rem;
          animation: heroReveal 1.2s var(--transition) both;
        }

        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 1.5rem;
          border: 1px solid rgba(124, 1, 26, 0.25);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          backdrop-filter: blur(12px);
          background: var(--red-dim);
        }

        .hero-eyebrow::before {
          content: '';
          width: 5px;
          height: 5px;
          background: var(--red);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(3.2rem, 8vw, 6.5rem);
          font-weight: 300;
          line-height: 1.04;
          letter-spacing: -0.01em;
          margin-bottom: 1.5rem;
          color: var(--text-heading);
        }

        .hero-title em {
          font-style: italic;
          color: var(--primary);
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.18rem);
          font-weight: 300;
          color: var(--text-primary);
          max-width: 560px;
          margin: 0 auto 2.8rem;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary);
          color: #080405;
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 0.9rem 2.2rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s var(--transition);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.15);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }

        .btn-primary:hover::after { opacity: 1; }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(240, 231, 213, 0.3);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--glass-bg);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 0.9rem 2.2rem;
          border-radius: 4px;
          border: 1px solid var(--glass-border);
          cursor: pointer;
          text-decoration: none;
          backdrop-filter: blur(16px);
          transition: all 0.3s var(--transition);
        }

        .btn-ghost:hover {
          border-color: var(--primary-border);
          background: var(--primary-dim);
          color: var(--primary);
          transform: translateY(-2px);
        }

        .hero-scroll {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.5;
          animation: scrollBob 2.5s ease-in-out infinite;
          color: var(--primary);
        }

        .hero-scroll span {
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--primary);
        }

        @keyframes scrollBob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }

        /* ── SECTION SHARED ── */
        .section {
          padding: 7rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .section-full {
          padding: 7rem 2rem;
          position: relative;
        }

        .section-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          font-weight: 400;
          line-height: 1.08;
          color: var(--text-heading);
          margin-bottom: 1.2rem;
          letter-spacing: -0.01em;
        }

        .section-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 520px;
          line-height: 1.8;
        }

        .section-header {
          margin-bottom: 4rem;
        }

        /* ── DIVIDER LINE ── */
        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--red-mist) 20%, var(--glass-border) 50%, var(--red-mist) 80%, transparent);
        }

        /* ── BENEFITS GRID ── */
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .benefit-card {
          background:
            radial-gradient(ellipse 120% 80% at 0% 100%, rgba(124, 1, 26, 0.04) 0%, transparent 80%),
            var(--surface-1);
          padding: 2.2rem;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          transition: all 0.4s var(--transition);
          position: relative;
          overflow: hidden;
        }

        .benefit-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--red), transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .benefit-card:hover {
          background: radial-gradient(ellipse 120% 80% at 0% 100%, rgba(124, 1, 26, 0.08) 0%, transparent 80%), var(--surface-2);
          border-color: rgba(124, 1, 26, 0.15);
          transform: translateY(-3px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
        }
        .benefit-card:hover::before { opacity: 1; }

        .benefit-icon {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(124, 1, 26, 0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          background: var(--red-dim);
          flex-shrink: 0;
        }

        .benefit-icon svg {
          width: 20px;
          height: 20px;
          stroke: var(--primary);
          fill: none;
          stroke-width: 1.5;
        }

        .benefit-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 500;
          color: var(--text-heading);
          margin-bottom: 0.6rem;
          line-height: 1.3;
        }

        .benefit-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.75;
        }

        /* ── MEMBERSHIP TYPES ── */
        .membership-section {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse 70% 25% at 50% 0%, rgba(124, 1, 26, 0.08) 0%, transparent 100%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(124, 1, 26, 0.04) 0%, transparent 100%),
            linear-gradient(180deg, var(--surface-0) 0%, var(--surface-1) 50%, var(--surface-0) 100%);
        }
        .membership-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--red-mist) 30%, var(--red-glow) 50%, var(--red-mist) 70%, transparent);
          opacity: 0.6;
        }

        .membership-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .membership-card {
          background:
            radial-gradient(ellipse 100% 50% at 50% 0%, rgba(124, 1, 26, 0.04) 0%, transparent 100%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(124, 1, 26, 0.03) 0%, transparent 100%),
            linear-gradient(180deg, var(--surface-2) 0%, var(--surface-0) 100%);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 2.8rem 2.4rem;
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
          will-change: transform;
        }

        .membership-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 13px;
          background: linear-gradient(
            135deg,
            transparent 25%,
            rgba(124, 1, 26, 0.12) 40%,
            rgba(240, 231, 213, 0.18) 50%,
            rgba(124, 1, 26, 0.12) 60%,
            transparent 75%
          );
          background-size: 300% 300%;
          opacity: 0;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.6s ease;
        }

        .membership-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(240, 231, 213, 0.06) 0%, transparent 70%);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          transition: opacity 0.4s;
        }

        .membership-card > * {
          position: relative;
          z-index: 2;
        }

        .membership-card:hover {
          border-color: rgba(240, 231, 213, 0.2);
          transform: translateY(-8px) scale(1.01);
          box-shadow:
            0 32px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(240, 231, 213, 0.06),
            0 0 60px rgba(124, 1, 26, 0.08);
        }
        .membership-card:hover::after { opacity: 1; }
        .membership-card:hover::before {
          opacity: 1;
          animation: borderGlide 2.5s ease-in-out infinite;
        }

        @keyframes borderGlide {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .membership-badge {
          position: absolute;
          top: 1.4rem;
          right: 1.4rem;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--primary);
          border: 1px solid var(--primary-border);
          padding: 0.25rem 0.7rem;
          border-radius: 100px;
          background: var(--primary-dim);
        }

        .membership-icon-wrap {
          width: 56px;
          height: 56px;
          border: 1px solid rgba(124, 1, 26, 0.15);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--red-dim);
        }

        .membership-icon-wrap svg {
          width: 24px;
          height: 24px;
          stroke: var(--primary);
          fill: none;
          stroke-width: 1.5;
        }

        .membership-type-label {
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240, 231, 213, 0.6);
          margin-bottom: 0.4rem;
        }

        .membership-name {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 500;
          line-height: 1.1;
          color: var(--text-heading);
        }

        .membership-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.75;
        }

        .membership-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .membership-features li {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          font-size: 0.875rem;
          color: var(--text-primary);
          line-height: 1.55;
        }

        .check-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          margin-top: 2px;
          stroke: var(--red);
          fill: none;
          stroke-width: 2.5;
        }

        .btn-membership {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.95rem 1.5rem;
          border-radius: 6px;
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s var(--transition);
        }

        .btn-membership-outline {
          background: transparent;
          color: var(--primary);
          border: 1px solid var(--primary-border);
        }

        .btn-membership-outline:hover {
          border-color: var(--primary);
          color: var(--surface-0);
          background: var(--primary);
        }

        .btn-membership-fill {
          background: var(--primary);
          color: #080405;
          border: 1px solid var(--primary);
        }

        .btn-membership-fill:hover {
          background: var(--primary-bright);
          box-shadow: 0 6px 24px rgba(240, 231, 213, 0.3);
          transform: translateY(-1px);
        }

        .stat-label {
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        /* ── CTA FINAL ── */
        .cta-section {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse 60% 40% at 50% 30%, rgba(124, 1, 26, 0.20) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 50% 80%, rgba(240, 231, 213, 0.04) 0%, transparent 60%),
            linear-gradient(180deg, var(--surface-1) 0%, var(--surface-0) 100%);
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--red-mist) 30%, var(--red-glow) 50%, var(--red-mist) 70%, transparent);
          opacity: 0.5;
        }

        .cta-inner {
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
          padding: 8rem 2rem;
          position: relative;
          z-index: 1;
        }

        .cta-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4.2rem);
          font-weight: 400;
          line-height: 1.06;
          color: var(--text-heading);
          margin-bottom: 1.2rem;
          letter-spacing: -0.01em;
        }

        .cta-title em {
          font-style: italic;
          color: var(--primary);
        }

        .cta-text {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 2.8rem;
          line-height: 1.8;
          max-width: 520px;
          margin-inline: auto;
        }

        .cta-note {
          margin-top: 1.5rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        /* ── FOOTER STRIP ── */
        .footer-strip {
          border-top: 1px solid var(--red-mist);
          padding: 2.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: 1rem;
          background:
            radial-gradient(ellipse 50% 100% at 50% 0%, rgba(124, 1, 26, 0.04) 0%, transparent 100%);
        }

        .footer-logo {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: var(--text-heading);
        }

        .footer-logo span { color: var(--red); }

        .footer-copy {
          font-size: 0.75rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .hero-actions { flex-direction: column; align-items: center; }
          .hero-actions a, .hero-actions button { width: 100%; max-width: 320px; justify-content: center; }
          .benefits-grid { grid-template-columns: 1fr; }
          .membership-grid { grid-template-columns: 1fr; }
        }

        /* ── SCROLL ANIMATIONS ── */
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s var(--transition), transform 0.7s var(--transition);
        }
        .fade-up.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        .fade-up-3d {
          opacity: 0;
          transform: perspective(900px) rotateX(4deg) translateY(36px) scale(0.96);
          transform-origin: top center;
          transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }
        .fade-up-3d.in-view {
          opacity: 1;
          transform: perspective(900px) rotateX(0deg) translateY(0) scale(1);
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(240, 231, 213, 0.15); }
          50% { box-shadow: 0 4px 32px rgba(240, 231, 213, 0.35), 0 0 0 4px rgba(240, 231, 213, 0.08); }
        }
        .btn-pulse {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
        .btn-pulse:hover {
          animation: none;
        }

        /* ── MICRO-INTERACTIONS ── */
        .benefit-card:hover .benefit-icon {
          border-color: var(--red-bright);
          background: rgba(124, 1, 26, 0.15);
          transform: scale(1.08);
        }
        .benefit-card:hover .benefit-icon svg {
          stroke-width: 2;
          stroke: var(--primary-bright);
        }
        .benefit-icon {
          transition: border-color 0.4s var(--transition), transform 0.4s var(--transition), background 0.4s var(--transition);
        }
        .benefit-icon svg {
          transition: stroke-width 0.3s var(--transition), stroke 0.3s var(--transition);
        }

        .membership-card:hover .membership-icon-wrap {
          border-color: var(--red-bright);
          background: rgba(124, 1, 26, 0.15);
          transform: scale(1.10) rotateY(6deg);
          box-shadow: 0 0 40px rgba(124, 1, 26, 0.15);
        }
        .membership-card:hover .membership-icon-wrap svg {
          stroke-width: 2;
          stroke: var(--primary-bright);
        }
        .membership-icon-wrap {
          transition: border-color 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      background 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          perspective: 600px;
        }
        .membership-icon-wrap svg {
          transition: stroke-width 0.3s ease, stroke 0.3s ease;
        }

        .membership-card:hover .membership-name {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-bright) 50%, var(--primary) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: nameShimmer 2s ease-in-out infinite;
        }
        .membership-name {
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes nameShimmer {
          0%   { background-position: 0% center; }
          50%  { background-position: 100% center; }
          100% { background-position: 0% center; }
        }

        .membership-features li {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .membership-card:hover .membership-features li {
          transform: translateX(6px);
        }
        .membership-card:hover .membership-features li:nth-child(2) { transition-delay: 0.04s; }
        .membership-card:hover .membership-features li:nth-child(3) { transition-delay: 0.08s; }
        .membership-card:hover .membership-features li:nth-child(4) { transition-delay: 0.12s; }
        .membership-card:hover .membership-features li:nth-child(5) { transition-delay: 0.16s; }
        .membership-card:hover .membership-features li:nth-child(6) { transition-delay: 0.20s; }

        .membership-features li:hover .check-icon {
          transform: scale(1.3) rotate(-3deg);
        }
        .check-icon {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .btn-membership {
          position: relative;
          overflow: hidden;
        }
        .btn-membership::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 30%,
            rgba(240, 231, 213, 0.10) 50%,
            transparent 70%
          );
          background-size: 200% 200%;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .btn-membership:hover::after {
          opacity: 1;
          animation: borderGlide 1.5s ease-in-out infinite;
        }
        .btn-membership svg {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .btn-membership:hover svg {
          transform: translateX(5px) scale(1.1);
        }

        .btn-ghost svg {
          transition: transform 0.25s var(--transition);
        }
        .btn-ghost:hover svg {
          transform: translateX(3px);
        }

        /* ── DECORATIVE AMBIENT ── */
        @keyframes ambientGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.7; }
        }
        .hero-video {
          animation: ambientGlow 8s ease-in-out infinite;
        }

        /* ── REDUCED MOTION ── */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          html { scroll-behavior: auto; }
          .fade-up { opacity: 1; transform: none; }
        }
      `}</style>

      <div className={`page-wrapper${mounted ? ' visible' : ''}`}>

        {/* ══════════ HERO ══════════ */}
        <section className="hero">
          <video
            className="hero-video"
            autoPlay
            poster="/heromunpage.jpg"
            muted
            loop
            playsInline
            src="/heromunpage.mp4"
          />
          <div className="hero-overlay" />

          <div className="hero-content">

            <h1 className="hero-title">
              Membresía<br /><em>SoPeD</em>
            </h1>
            <p className="hero-subtitle">
              Accede a programas académicos, competencias internacionales,
              certificaciones y una comunidad de debate de alto nivel.
            </p>
            <div className="hero-actions">
              <a href="#membresia" className="btn-primary">
                Convertirse en miembro
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="#beneficios" className="btn-ghost">
                Explorar beneficios
              </a>
            </div>
          </div>

          <div className="hero-scroll">
            <svg width="16" height="22" viewBox="0 0 16 22" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="1" y="1" width="14" height="20" rx="7"/>
              <line x1="8" y1="5" x2="8" y2="9"/>
            </svg>
            <span>Scroll</span>
          </div>
        </section>

        {/* ══════════ BENEFICIOS ══════════ */}
        <section id="beneficios" className="section">
          <div className="section-header fade-up">
            <div className="section-label">Beneficios</div>
            <h2 className="section-title">Todo lo que obtienes<br />como miembro</h2>
            <p className="section-subtitle">
              La membresía SoPeD te integra a un ecosistema académico de primer nivel,
              con acceso exclusivo a programas, redes y oportunidades de crecimiento.
            </p>
          </div>

          <div className="benefits-grid">
            {[
              {
                title: 'Direccion de proyectos',
                desc: 'Articula proyectos académicos y de impacto con el acompañamiento, recursos y soporte institucional de SoPeD.',
                icon: (
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                ),
              },
              {
                title: 'Certificaciones Oficiales',
                desc: 'Recibirás un carnet físico de miembro oficial de la Sociedad Peruana de Debate y un certificado que acredita tu condicion de miembro oficial de la Sociedad Peruana de Debate',
                icon: (
                  <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                ),
              },
              {
                title: 'Eventos Académicos',
                desc: 'Acceso prioritario a talleres, seminarios, conferencias y competencias nacionales e internacionales durante todo el año.',
                icon: (
                  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ),
              },
              {
                title: 'Red Institucional',
                desc: 'Conecta con estudiantes, docentes y líderes de diversas instituciones de todo el Perú que forman parte de la comunidad SoPeD.',
                icon: (
                  <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ),
              },
              {
                title: 'Staff y Liderazgo',
                desc: 'Accede a posiciones de staff organizador, coordinación de comités y roles de liderazgo en los programas institucionales.',
                icon: (
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ),
              },
              {
                title: 'Debate Competitivo',
                desc: 'Formación intensiva en técnicas de argumentación, oratoria y debate formal bajo metodologías reconocidas internacionalmente.',
                icon: (
                  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
              },
            ].map((b, i) => (
              <div className="benefit-card fade-up" key={b.title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="benefit-icon">{b.icon}</div>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ══════════ TIPOS DE MEMBRESÍA ══════════ */}
        <section id="membresia" className="section-full membership-section">
          <div className="section" style={{ paddingTop: 0, paddingBottom: '3.5rem' }}>
            <div className="section-label fade-up">Tipos de membresía</div>
            <h2 className="section-title fade-up">Elige tu forma<br />de participar</h2>
            <p className="section-subtitle fade-up">
              Cada modalidad está diseñada para responder a las necesidades de
              diferentes actores dentro del ecosistema SoPeD.
            </p>
          </div>

          <div className="membership-grid">
            {/* Individual */}
            <div className="membership-card fade-up-3d" data-delay="0">
              <div className="membership-icon-wrap">
                <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div>
                <div className="membership-type-label">Membresía</div>
                <div className="membership-name">Individual</div>
              </div>
              <p className="membership-desc">
                Para personas naturales que buscan desarrollarse en debate,
                diplomacia y pensamiento crítico.
              </p>
              <ul className="membership-features">
                {[
                  'Acceso a programas académicos SoPeD',
                  'Participación en MUN y debate escolar',
                  'Certificaciones por programa completado',
                  'Acceso a la red estudiantil nacional',
                  'Descuentos en eventos oficiales',
                ].map((f) => (
                  <li key={f}>
                    <svg className="check-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/membresia/individual" className="btn-membership btn-membership-outline">
                Continuar
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Institución */}
            <div className="membership-card fade-up-3d" data-delay="100">
              <div className="membership-icon-wrap">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div>
                <div className="membership-type-label">Membresía</div>
                <div className="membership-name">Institución</div>
              </div>
              <p className="membership-desc">
                Para grupos, circulos, colegios, universidades y demas que desean participar como delegaciones
                oficiales y representar a su institución en programas SoPeD.
              </p>
              <ul className="membership-features">
                {[
                  'Representación oficial de tu institución',
                  'Delegaciones completas en MUN',
                  'Gestión centralizada de miembros',
                  'Convenios académicos institucionales',
                  'Acceso prioritario a todos los eventos',
                  'Soporte directo del equipo SoPeD',
                ].map((f) => (
                  <li key={f}>
                    <svg className="check-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/membresia/institucional" className="btn-membership btn-membership-outline">
                Ser miembro institucional
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Staff */}
            <div className="membership-card fade-up-3d" data-delay="200">
              <div className="membership-icon-wrap">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              </div>
              <div>
                <div className="membership-type-label">Membresía</div>
                <div className="membership-name">Staff &amp; Voluntariado</div>
              </div>
              <p className="membership-desc">
                Para quienes desean contribuir activamente en la organización de
                eventos y programas desde adentro de la institución.
              </p>
              <ul className="membership-features">
                {[
                  'Rol activo en organización de eventos',
                  'Acceso a formación interna SoPeD',
                  'Experiencia institucional verificable',
                  'Carta de reconocimiento oficial',
                  'Red exclusiva de organizadores',
                ].map((f) => (
                  <li key={f}>
                    <svg className="check-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-membership btn-membership-outline">
                Continuar
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </section>

        {/* ══════════ CTA FINAL ══════════ */}
        <section className="cta-section">
          <div className="cta-inner fade-up">
            <div className="section-label" style={{ marginBottom: '1.2rem' }}>Únete hoy</div>
            <h2 className="cta-title">
              Forma parte de<br /><em>SoPeD</em> hoy
            </h2>
            <p className="cta-text">
              Miles de estudiantes y organizaciones ya son parte de la comunidad
              académica más activa del debate peruano. El siguiente paso es tuyo.
            </p>
            <a href="#membresia" className="btn-primary" style={{ fontSize: '0.92rem', padding: '1rem 2.4rem' }}>
              Iniciar proceso de membresía
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <p className="cta-note">Proceso 100% en línea</p>
          </div>
        </section>

        

      </div>

      
    </>
  );
}

