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
  { area: 'security', label: 'Security', href: '/security.html' },
  { area: 'insights', label: 'Insights', href: '/insights.html' },
  { area: 'handoff', label: 'Human handoff', href: '/human-handoff.html' },
];

// Answer-first FAQ for discovery/evaluation queries (AEO). Keep answers visible
// and factual; add FAQ structured data only after the same copy is verified.
const homeFaqs = [
  {
    q: 'What is AI-powered IT support automation?',
    a: 'AI-powered IT support automation uses request understanding, identity and device context, policies, and approved workflows to complete routine support work. Nevian can carry a request from intake through verification, action, audit, and closure, while handing exceptions to a person.',
  },
  {
    q: 'What IT requests can Nevian automate?',
    a: 'Nevian is designed for repeatable requests such as password and MFA resets, account unlocks, approved access changes, software installs, account provisioning, endpoint checks, routine remediations, and status updates. Available actions depend on the connected systems and policies your team approves.',
  },
  {
    q: 'Does Nevian replace the IT team?',
    a: 'No. Nevian handles approved, repeatable work and escalates requests that need judgment, unavailable access, additional approval, or investigation. The receiving engineer gets the identity, device context, conversation, attempted actions, diagnostics, and audit history.',
  },
  {
    q: 'Which systems does Nevian work with?',
    a: 'Nevian works with Microsoft 365, Microsoft Entra ID, Azure, PowerShell, Windows, Windows Server, Jira, and ServiceNow. Available actions depend on the connected product, licensing, and the permissions your team approves.',
  },
  {
    q: 'How long does Nevian take to deploy?',
    a: 'Deployment depends on the workflows, systems, policies, and approval requirements in scope. Nevian begins with discovery, selects a focused first rollout, connects the required systems, tests each workflow with the IT team, and expands after the initial workflows are validated.',
  },
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
          <p>Nevian is an AI-powered IT support platform. It verifies the requester, checks live device and directory context, follows your policies, completes approved actions, and hands exceptions to the right person with a full audit trail.</p>
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
        <h2 className="scratch-bento-title">One platform for AI-powered IT support,<br />endpoint context, and secure automation</h2>
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

      <section className="sec-faq" aria-label="Frequently asked questions">
        <h2 className="feature-caps-title">Frequently asked<br />questions</h2>
        <div className="sec-faq-list">
          {homeFaqs.map((item) => (
            <details className="sec-faq-item" key={item.q}>
              <summary>
                {item.q}
                <span className="sec-faq-mark" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <ContactSection />
      <Footer showCta={false} />
    </main>
  );
}
