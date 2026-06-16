export const pwStyles = `
  .pw-page {
    min-height: 100vh;
    overflow-x: hidden;
  }
  .pw-container {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 1.75rem;
  }
  @media (min-width: 1024px) {
    .pw-container { padding: 0 2.5rem; }
  }

  .pw-eyebrow {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--font-outfit);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(236,229,214,0.55);
    margin-bottom: 1rem;
  }
  .pw-eyebrow-line {
    display: block;
    width: 1.75rem;
    height: 1px;
    background: rgba(236,229,214,0.35);
    flex-shrink: 0;
  }

  .pw-h2 {
    font-family: var(--font-cormorant);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 400;
    color: var(--text-primary);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
    max-width: 700px;
  }
  .pw-h2 em {
    font-style: italic;
    color: rgba(236,229,214,0.85);
  }

  .pw-body {
    font-family: var(--font-outfit);
    font-size: 0.92rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.85;
  }

  .pw-section {
    padding: 6rem 0;
  }
  .pw-section-dark {
    background: radial-gradient(ellipse 60% 30% at 50% 0%, rgba(160,16,40,0.08) 0%, transparent 100%);
  }
  @media (max-width: 480px) {
    .pw-section { padding: 3.5rem 0; }
  }

  .pw-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .pw-reveal.pw-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .pw-hero {
    position: relative;
    min-height: 90vh;
    display: flex;
    align-items: center;
    padding: 7rem 0 4rem;
    overflow: hidden;
  }
  .pw-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 700px 500px at 30% -100px, rgba(160,16,40,0.3) 0%, transparent 100%),
      radial-gradient(ellipse 500px 600px at 100% 20%, rgba(160,16,40,0.15) 0%, transparent 100%),
      radial-gradient(ellipse 800px 300px at 50% 100%, rgba(160,16,40,0.1) 0%, transparent 100%),
      linear-gradient(180deg, #1A080A 0%, transparent 100%);
  }
  .pw-hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  @media (max-width: 860px) {
    .pw-hero-inner { grid-template-columns: 1fr; gap: 3rem; }
    .pw-hero { min-height: auto; padding: 6rem 0 3rem; }
  }
  .pw-hero-title {
    font-family: var(--font-cormorant);
    font-size: clamp(2.8rem, 6vw, 5rem);
    font-weight: 400;
    color: var(--text-primary);
    line-height: 1.06;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
  }
  .pw-hero-title em {
    font-style: italic;
    color: rgba(236,229,214,0.9);
  }
  .pw-hero-sub {
    font-family: var(--font-outfit);
    font-size: 0.95rem;
    color: rgba(255,255,255,0.4);
    line-height: 1.8;
    max-width: 500px;
    margin-bottom: 2rem;
  }
  .pw-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  @media (max-width: 480px) {
    .pw-hero-actions { flex-direction: column; width: 100%; }
    .pw-hero-actions a { width: 100%; justify-content: center; }
  }

  .pw-badge-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  .pw-badge-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 1.75rem 1rem;
    text-align: center;
    border-radius: 6px;
  }
  .pw-badge-icon {
    width: 22px;
    height: 22px;
    color: rgba(236,229,214,0.35);
    margin-bottom: 0.25rem;
  }
  .pw-badge-n {
    font-family: var(--font-cormorant);
    font-size: 1.6rem;
    font-weight: 400;
    color: var(--text-primary);
    line-height: 1;
  }
  .pw-badge-l {
    font-family: var(--font-outfit);
    font-size: 0.65rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  @media (max-width: 480px) {
    .pw-badge-grid { grid-template-columns: 1fr 1fr; }
  }

  .pw-skills-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 2rem;
  }
  @media (max-width: 860px) {
    .pw-skills-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .pw-skills-grid { grid-template-columns: 1fr; }
  }
  .pw-skill-card {
    padding: 1.75rem;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .pw-skill-icon-wrap {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(236,229,214,0.1);
    border-radius: 4px;
    color: rgba(236,229,214,0.5);
    transition: color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
  }
  .pw-skill-icon-wrap svg {
    width: 20px;
    height: 20px;
  }
  .pw-skill-card:hover .pw-skill-icon-wrap {
    color: rgba(236,229,214,0.85);
    border-color: rgba(236,229,214,0.3);
    transform: scale(1.05);
  }
  .pw-skill-title {
    font-family: var(--font-outfit);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  .pw-skill-desc {
    font-family: var(--font-outfit);
    font-size: 0.82rem;
    color: rgba(255,255,255,0.35);
    line-height: 1.65;
  }

  .pw-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 2rem;
    max-width: 700px;
  }
  .pw-step {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }
  .pw-step-dot-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 48px;
  }
  .pw-step-dot {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid rgba(236,229,214,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-outfit);
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba(236,229,214,0.7);
    background: rgba(236,229,214,0.04);
    flex-shrink: 0;
    transition: border-color 0.3s ease, background 0.3s ease;
  }
  .pw-step:hover .pw-step-dot {
    border-color: rgba(236,229,214,0.45);
    background: rgba(236,229,214,0.08);
  }
  .pw-step-line {
    width: 1px;
    flex: 1;
    background: linear-gradient(to bottom, rgba(236,229,214,0.15), transparent);
    min-height: 2rem;
  }
  .pw-step-content {
    padding-top: 0.6rem;
    padding-bottom: 2rem;
  }
  .pw-step-title {
    font-family: var(--font-outfit);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.4rem;
  }
  .pw-step-desc {
    font-family: var(--font-outfit);
    font-size: 0.82rem;
    color: rgba(255,255,255,0.35);
    line-height: 1.65;
  }

  .pw-profile-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 2rem;
  }
  @media (max-width: 860px) {
    .pw-profile-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .pw-profile-grid { grid-template-columns: 1fr; }
  }
  .pw-profile-card {
    padding: 1.75rem;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .pw-profile-index {
    font-family: var(--font-cormorant);
    font-size: 1.2rem;
    font-weight: 300;
    font-style: italic;
    color: rgba(236,229,214,0.12);
    line-height: 1;
  }
  .pw-profile-title {
    font-family: var(--font-outfit);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  .pw-profile-desc {
    font-family: var(--font-outfit);
    font-size: 0.82rem;
    color: rgba(255,255,255,0.35);
    line-height: 1.65;
  }
  .pw-profile-card:hover .pw-profile-index {
    color: rgba(236,229,214,0.25);
  }

  .pw-benefits-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-top: 2rem;
  }
  @media (max-width: 860px) {
    .pw-benefits-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .pw-benefits-grid { grid-template-columns: 1fr; }
  }
  .pw-benefit-card {
    padding: 1.75rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
  }
  .pw-benefit-card:hover {
    background: rgba(255,255,255,0.035);
    border-color: rgba(236,229,214,0.1);
    transform: translateY(-2px);
  }
  .pw-benefit-icon-wrap {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(236,229,214,0.25);
    transition: color 0.3s ease;
  }
  .pw-benefit-icon-wrap svg { width: 22px; height: 22px; }
  .pw-benefit-card:hover .pw-benefit-icon-wrap {
    color: rgba(236,229,214,0.65);
  }
  .pw-benefit-title {
    font-family: var(--font-outfit);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  .pw-benefit-desc {
    font-family: var(--font-outfit);
    font-size: 0.78rem;
    color: rgba(255,255,255,0.3);
    line-height: 1.6;
  }

  .pw-cta-section {
    position: relative;
    text-align: center;
    padding: 6rem 0;
    overflow: hidden;
  }
  .pw-cta-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 600px 300px at 50% 50%, rgba(160,16,40,0.25) 0%, transparent 100%);
    pointer-events: none;
  }
  .pw-cta-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .pw-cta-title {
    font-family: var(--font-cormorant);
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 400;
    color: var(--text-primary);
    line-height: 1.12;
    letter-spacing: -0.02em;
    max-width: 620px;
    margin-inline: auto;
  }
  .pw-cta-title em {
    font-style: italic;
    color: rgba(236,229,214,0.85);
  }
  .pw-cta-rule {
    width: 40px;
    height: 1px;
    background: rgba(236,229,214,0.3);
  }
  .pw-cta-desc {
    font-family: var(--font-outfit);
    font-size: 0.85rem;
    color: rgba(255,255,255,0.35);
    max-width: 460px;
    line-height: 1.7;
  }

  @media (max-width: 480px) {
    .pw-hero-title { font-size: 2.2rem; }
    .pw-hero-sub { font-size: 0.85rem; }
    .pw-badge-card { padding: 1.25rem 0.75rem; }
    .pw-badge-n { font-size: 1.3rem; }
  }
`
