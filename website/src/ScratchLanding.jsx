import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import PasswordResetDemo from './components/PasswordResetDemo.jsx';
import Integrations from './components/Integrations.jsx';
import FitSection from './components/FitSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import ScratchNav from './components/ScratchNav.jsx';
import { ArrowIcon, bentoContent } from './components/BentoVisuals.jsx';

gsap.registerPlugin(ScrollToPlugin);

// Bento cards mirror the reference layout: label + arrow anchored bottom-left,
// media area left open for real assets. Wording is drawn from the product.
// Each `href` opens the dedicated page for that capability.
const bentoCards = [
  { area: 'triage', label: 'Cut routine workload', href: '/workload.html' },
  { area: 'context', label: 'Device context', href: '/device-context.html' },
  { area: 'identity', label: 'Identity verification', href: '/identity-verification.html' },
  { area: 'integrations', label: 'Integrations', href: '/integrations.html' },
  { area: 'audit', label: 'Audit trail', href: '/audit-trail.html' },
  { area: 'routing', label: 'Smart routing', href: '/smart-routing.html' },
  { area: 'security', label: 'Security', href: '/#password-reset' },
  { area: 'insights', label: 'Insights', href: '/#how' },
  { area: 'handoff', label: 'Human handoff', href: '/#how' },
];

export default function ScratchLanding() {
  const [demoRun, setDemoRun] = useState(0);
  const [workloadReduction, setWorkloadReduction] = useState(0);

  // GSAP-powered smooth scroll for in-page hash links (nav, platform menu, hero).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handleClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const raw = link.getAttribute('href') || '';
      const hashIndex = raw.indexOf('#');
      if (hashIndex < 0) return;
      const before = raw.slice(0, hashIndex);
      if (before && before !== '/') return; // link points to another page
      const hash = raw.slice(hashIndex);
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      gsap.to(window, {
        duration: reduce ? 0 : 0.9,
        ease: 'power2.inOut',
        scrollTo: { y: target, offsetY: 68 },
      });
      window.history.pushState(null, '', hash);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWorkloadReduction(60);
      return undefined;
    }

    const duration = 1400;
    const startedAt = performance.now();
    let frame = 0;

    const update = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      setWorkloadReduction(Math.round(60 * eased));
      if (progress < 1) frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="scratch-page">
      <ScratchNav />

      <section className="scratch-hero" id="top">
        <a className="scratch-release scratch-release-mobile" href="#how">Nevian AI <span>See it resolve a request</span><ArrowIcon /></a>
        <div className="scratch-hero-copy">
          <h1 aria-label="Cut routine IT workload by up to 60%">Cut routine IT workload by up to <strong aria-hidden="true">{workloadReduction}%</strong></h1>
          <p>Nevian combines identity, endpoint context, and policy-aware automation to resolve repetitive requests safely before they enter your team&apos;s queue.</p>
          <div className="scratch-actions">
            <a className="scratch-primary" href="#contact">Book a demo</a>
          </div>
        </div>
        <a className="scratch-release scratch-release-desktop" href="#how"><b>Nevian AI</b> Password reset, start to finish <ArrowIcon /></a>
      </section>

      <section className="scratch-stage" id="how" aria-label="Nevian password reset demo">
        <div className="scratch-browser">
          <div className="scratch-browser-bar">
            <div className="scratch-browser-dots"><i /><i /><i /></div>
            <div className="scratch-browser-address"><span aria-hidden="true">⌕</span> your-company.nevian-info.com/support</div>
            <div className="scratch-browser-tools">
              <button type="button" onClick={() => setDemoRun((run) => run + 1)} aria-label="Restart demo" title="Restart demo">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 6.5A6 6 0 1 0 16 12M15.5 3v3.5H12" /></svg>
              </button>
              <a href="#contact" aria-label="Open support" title="Open support">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 4h5v5M16 4l-7 7M15 11v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" /></svg>
              </a>
            </div>
          </div>
          <div className="scratch-demo"><PasswordResetDemo key={demoRun} /></div>
        </div>
      </section>

      <Integrations />

      <section className="scratch-bento" id="features" aria-label="The Nevian platform">
        <h2 className="scratch-bento-title">Not just a chatbot,<br />a full platform</h2>
        <div className="scratch-bento-grid">
          {bentoCards.map((card) => (
            <article key={card.area} className={`scratch-bento-card scratch-bento-${card.area}`}>
              <div className="scratch-bento-media">{bentoContent[card.area] || null}</div>
              <a className="scratch-bento-label" href={card.href}>{card.label} <ArrowIcon /></a>
            </article>
          ))}
        </div>
      </section>

      <FitSection />
      <ContactSection />
      <Footer showCta={false} />
    </main>
  );
}
