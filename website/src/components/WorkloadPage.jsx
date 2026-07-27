import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScratchNav from './ScratchNav.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';
import { WorkloadVitals, AuditTrail } from './BentoVisuals.jsx';

gsap.registerPlugin(ScrollToPlugin);

// The incoming queue split into what Nevian handles vs. what a person sees.
function WorkloadQueue() {
  const tickets = [
    { id: '#4821', title: 'Password reset', state: 'auto' },
    { id: '#4822', title: 'VPN access request', state: 'auto' },
    { id: '#4823', title: 'Install approved app', state: 'auto' },
    { id: '#4824', title: 'Mailbox delegation', state: 'auto' },
    { id: '#4825', title: 'Failed backup on NEV-SRV-03', state: 'human' },
  ];
  return (
    <div className="wl-queue" aria-hidden="true">
      <div className="wl-queue-head">
        <span>Incoming queue</span>
        <em>Live</em>
      </div>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id} className={`wl-queue-row is-${ticket.state}`}>
            <span className="wl-queue-id">{ticket.id}</span>
            <span className="wl-queue-title">{ticket.title}</span>
            <span className="wl-queue-tag">{ticket.state === 'auto' ? 'Auto-resolved' : 'To a person'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The routine request types that most fill an IT queue, with a share bar.
function WorkloadCategories() {
  const categories = [
    { label: 'Password & MFA resets', fill: 92 },
    { label: 'Access & permissions', fill: 74 },
    { label: 'Software install requests', fill: 63 },
    { label: 'Account & device setup', fill: 51 },
  ];
  return (
    <div className="wl-cats" aria-hidden="true">
      {categories.map((category) => (
        <div className="wl-cat" key={category.label}>
          <div className="wl-cat-row">
            <span>{category.label}</span>
            <strong>{category.fill}%</strong>
          </div>
          <div className="wl-cat-bar" style={{ '--fill': `${category.fill}%` }}><b /></div>
        </div>
      ))}
    </div>
  );
}

// A single large "time to first action" figure with a soft dial.
function WorkloadSpeed() {
  return (
    <div className="wl-speed" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="wl-speed-dial">
        <circle cx="60" cy="60" r="50" className="wl-speed-track" />
        <circle cx="60" cy="60" r="50" className="wl-speed-arc" />
      </svg>
      <div className="wl-speed-value"><strong>1.2s</strong><span>to first action</span></div>
    </div>
  );
}

const featurePanels = [
  {
    key: 'vitals',
    span: 'wide',
    visual: <WorkloadVitals />,
    title: 'Resolve routine tickets automatically.',
    body: 'Nevian handles password resets, access requests, and repetitive fixes from start to finish, verifying identity, checking policy, and closing the ticket without a person in the loop.',
  },
  {
    key: 'queue',
    visual: <WorkloadQueue />,
    title: 'Only the exceptions reach a human.',
    body: 'Routine requests are resolved on arrival. Your team sees the few tickets that genuinely need judgement, with everything already gathered.',
  },
  {
    key: 'cats',
    visual: <WorkloadCategories />,
    title: 'The requests that fill your queue.',
    body: 'The high-volume, low-variation work is exactly what Nevian is built to absorb, so the backlog stops growing on its own.',
  },
  {
    key: 'speed',
    visual: <WorkloadSpeed />,
    title: 'Action in seconds, not hours.',
    body: 'Requests are picked up the moment they land, with no waiting for someone to notice the queue.',
  },
  {
    key: 'audit',
    visual: <AuditTrail />,
    title: 'Every action stays on the record.',
    body: 'Each automated step is logged with identity, device, and outcome, so an auto-resolved ticket is as auditable as a manual one.',
  },
];

// Distinct thin-line icons per capability (no backing chip, Framer style).
const capIcons = {
  key: <><circle cx="8" cy="8" r="4" /><path d="M11 11l8 8M16 16l2-2M18.5 18.5l1.5-1.5" /></>,
  shield: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></>,
  install: <><path d="M12 3v11m0 0 4-4m-4 4-4-4" /><path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" /></>,
  user: <><circle cx="10" cy="7" r="3.2" /><path d="M4.5 20a5.5 5.5 0 0 1 11 0" /><path d="M18 6v6M15 9h6" /></>,
  wrench: <path d="M14.5 5.5a3.8 3.8 0 0 0-4.9 4.6L4 15.7 8.3 20l5.6-5.6a3.8 3.8 0 0 0 4.6-4.9l-2.3 2.3-2.1-.5-.5-2.1 2.3-2.3Z" />,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
};

const capabilities = [
  { icon: 'key', title: 'Password & MFA resets', body: 'Verify the person and reset safely, end to end.' },
  { icon: 'shield', title: 'Access requests', body: 'Grant scoped, policy-checked access on approval.' },
  { icon: 'install', title: 'Software installs', body: 'Push approved apps to the right device.' },
  { icon: 'user', title: 'Account provisioning', body: 'Set up new accounts and devices from a request.' },
  { icon: 'wrench', title: 'Routine fixes', body: 'Run known-good remediations automatically.' },
  { icon: 'bell', title: 'Status updates', body: 'Keep requesters informed without manual replies.' },
];

export default function WorkloadPage() {
  // Show a clean "/workload" in the address bar instead of "/workload.html"
  // (GitHub Pages still serves the .html file at that path).
  useEffect(() => {
    if (window.location.pathname.endsWith('/workload.html')) {
      const clean = window.location.pathname.replace(/\.html$/, '');
      window.history.replaceState(null, '', clean + window.location.hash);
    }
  }, []);

  // Smooth-scroll in-page hash links (e.g. the "Book a demo" -> contact sheet).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handleClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const raw = link.getAttribute('href') || '';
      if (!raw.startsWith('#')) return; // only same-page anchors
      const target = document.querySelector(raw);
      if (!target) return;
      event.preventDefault();
      gsap.to(window, {
        duration: reduce ? 0 : 0.9,
        ease: 'power2.inOut',
        scrollTo: { y: target, offsetY: 68 },
      });
      window.history.pushState(null, '', raw);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <main className="scratch-page feature-page">
      <ScratchNav />

      <section className="feature-hero">
        <a className="feature-eyebrow" href="/">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" /></svg>
          Home
        </a>
        <h1>Cut routine IT workload<br />before it reaches the queue</h1>
        <div className="feature-hero-actions">
          <a className="scratch-primary" href="#contact">Book a demo</a>
          <a className="scratch-secondary" href="/#how">See it resolve a request</a>
        </div>
      </section>

      <section className="feature-bento" aria-label="How Nevian cuts routine workload">
        <div className="feature-grid">
          {featurePanels.map((panel) => (
            <article key={panel.key} className={`feature-card ${panel.span === 'wide' ? 'is-wide' : ''}`}>
              <div className="feature-card-media">{panel.visual}</div>
              <div className="feature-card-copy">
                <h3><strong>{panel.title}</strong></h3>
                <p>{panel.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-caps" aria-label="What Nevian automates">
        <h2 className="feature-caps-title">The routine work Nevian takes off your team</h2>
        <div className="feature-caps-grid">
          {capabilities.map((cap) => (
            <div className="feature-cap" key={cap.title}>
              <svg className="feature-cap-icon" viewBox="0 0 24 24" aria-hidden="true">{capIcons[cap.icon]}</svg>
              <h4>{cap.title}</h4>
              <p>{cap.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ContactSection />
      <Footer showCta={false} />
    </main>
  );
}
