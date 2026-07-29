import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScratchNav from './ScratchNav.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';
import { HumanHandoff } from './BentoVisuals.jsx';

gsap.registerPlugin(ScrollToPlugin);

// Three short highlight cards, like the audit page's points row.
const points = [
  {
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></>,
    title: 'Knows its limits',
    body: 'Nevian escalates the moment a request needs human judgment, an approval, or access it does not hold.',
  },
  {
    icon: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 8a3 3 0 0 1 0 6M21 19a5 5 0 0 0-4-4.9" /></>,
    title: 'Routed to the right person',
    body: 'It picks the owner by skill, workload, and the systems involved, not a round-robin queue.',
  },
  {
    icon: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></>,
    title: 'Nothing is lost',
    body: 'Identity, full history, and every attempted action travel with the ticket, so no one starts from scratch.',
  },
];

// What the receiving engineer gets with every handoff.
const carriedIcons = {
  identity: <><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
  device: <><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M9 20h6m-3-3.5V20" /></>,
  history: <><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 4v4h-4" /><path d="M12 8v4l3 2" /></>,
  actions: <path d="M4 12l5 5L20 6" />,
  diagnostics: <path d="M3 12h4l2 6 4-14 2 8h6" />,
  ticket: <><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4Z" /><path d="M13 5v14" /></>,
  next: <><circle cx="12" cy="12" r="9" /><path d="M9 9a3 3 0 1 1 4 2.8c-.8.4-1 .8-1 1.7M12 16h.01" /></>,
  priority: <path d="m13.5 2-7 10H12l-1.5 10 7-11H12l1.5-9Z" />,
  approver: <><circle cx="10" cy="8" r="3.2" /><path d="M4.5 20a5.5 5.5 0 0 1 11 0" /><path d="M15 13l2 2 4-4" /></>,
  audit: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
};
const carried = [
  ['identity', 'Identity & device context'],
  ['history', 'Full conversation history'],
  ['actions', 'Actions already attempted'],
  ['diagnostics', 'Device diagnostics'],
  ['ticket', 'Linked ticket'],
  ['next', 'Suggested next step'],
  ['priority', 'Priority & SLA'],
  ['approver', 'Approver'],
  ['device', 'Which device'],
  ['audit', 'Audit trail'],
];

export default function HumanHandoffPage() {
  // Clean "/human-handoff" in the address bar.
  useEffect(() => {
    if (window.location.pathname.endsWith('/human-handoff.html')) {
      const clean = window.location.pathname.replace(/\.html$/, '');
      window.history.replaceState(null, '', clean + window.location.hash);
    }
  }, []);

  // Smooth-scroll same-page anchors (e.g. "Book a demo" -> contact sheet).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handleClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const raw = link.getAttribute('href') || '';
      if (!raw.startsWith('#')) return;
      const target = document.querySelector(raw);
      if (!target) return;
      event.preventDefault();
      gsap.to(window, { duration: reduce ? 0 : 0.9, ease: 'power2.inOut', scrollTo: { y: target, offsetY: 68 } });
      window.history.pushState(null, '', raw);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <main className="scratch-page feature-page device-page">
      <ScratchNav />

      <section className="feature-hero">
        <a className="feature-eyebrow" href="/">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" /></svg>
          Home
        </a>
        <h1>When it needs a person,<br />the person has everything</h1>
        <p>Nevian works a ticket as far as it safely can. When a human is the right call, it hands off to the right engineer with the full picture already in place.</p>
        <div className="feature-hero-actions">
          <a className="scratch-primary" href="#contact">Book a demo</a>
          <a className="scratch-secondary" href="/#how">See it resolve a request</a>
        </div>
      </section>

      <section className="sec-showcase" aria-label="A handoff with full context">
        <div className="sec-showcase-copy">
          <h2 className="feature-caps-title">A handoff,<br />not a restart</h2>
          <p>The engineer opens an escalation that already knows who the user is, what was tried, and what happened. No re-explaining, no digging through logs, no cold start.</p>
        </div>
        <div className="sec-showcase-visual hho-visual"><HumanHandoff /></div>
      </section>

      <section className="feature-caps" aria-label="How Nevian decides to escalate">
        <div className="feature-caps-grid audit-points">
          {points.map((point) => (
            <div className="feature-cap" key={point.title}>
              <svg className="feature-cap-icon" viewBox="0 0 24 24" aria-hidden="true">{point.icon}</svg>
              <h4>{point.title}</h4>
              <p>{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-caps" aria-label="What comes with every handoff">
        <h2 className="feature-caps-title">What comes with every handoff</h2>
        <div className="device-list-grid">
          {carried.map(([icon, label]) => (
            <div className="device-list-cell" key={label}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{carriedIcons[icon]}</svg>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <ContactSection />
      <Footer showCta={false} />
    </main>
  );
}
