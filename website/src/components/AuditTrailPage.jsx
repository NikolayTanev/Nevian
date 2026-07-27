import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScratchNav from './ScratchNav.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';

gsap.registerPlugin(ScrollToPlugin);

const entries = [
  { action: 'Identity verified', detail: 'Jordan Lee · via MFA push', kind: 'verify', time: 'now' },
  { action: 'Password reset', detail: 'finance portal · policy-checked', kind: 'action', time: '2m' },
  { action: 'Script run · reset-spooler.ps1', detail: 'NEV-LT-042 · as SYSTEM', kind: 'action', time: '8m' },
  { action: 'Access approved', detail: 'by Priya Raman (Manager)', kind: 'approval', time: '12m' },
  { action: 'Ticket #4821 closed', detail: 'Desk Agent · auto-resolved', kind: 'system', time: '14m' },
  { action: 'Written to audit log', detail: 'immutable entry', kind: 'system', time: '14m' },
];

const kindLabel = { verify: 'Verify', action: 'Action', approval: 'Approval', system: 'System' };

const points = [
  { icon: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>, title: 'Immutable by default', body: 'Entries are append-only. Nothing can be quietly edited or deleted.' },
  { icon: <><path d="M12 3v11m0 0 4-4m-4 4-4-4" /><path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" /></>, title: 'Exportable anytime', body: 'Stream to your SIEM or export to CSV whenever you need it.' },
  { icon: <><circle cx="12" cy="12" r="9" /><path d="M9.5 12l1.8 1.8L15 10" /></>, title: 'Full context on every line', body: 'Who, what, which device, the method used, and the result.' },
];

const captureIcons = {
  who: <><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
  what: <path d="m13.5 2-7 10H12l-1.5 10 7-11H12l1.5-9Z" />,
  when: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  device: <><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M9 20h6m-3-3.5V20" /></>,
  method: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></>,
  result: <path d="M5 12l4 4 10-10" />,
  policy: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /></>,
  approver: <><circle cx="10" cy="8" r="3.2" /><path d="M4.5 20a5.5 5.5 0 0 1 11 0" /><path d="M15 13l2 2 4-4" /></>,
  hash: <path d="M9 4l-2 16M17 4l-2 16M4 9h16M3 15h16" />,
  export: <><path d="M12 15V4m0 0 4 4m-4-4-4 4" /><path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" /></>,
};

const captured = [
  ['who', 'Who acted'],
  ['what', 'What happened'],
  ['when', 'When'],
  ['device', 'Which device'],
  ['method', 'Method used'],
  ['result', 'Result'],
  ['policy', 'Policy applied'],
  ['approver', 'Approver'],
  ['hash', 'Integrity hash'],
  ['export', 'Export'],
];

export default function AuditTrailPage() {
  useEffect(() => {
    if (window.location.pathname.endsWith('/audit-trail.html')) {
      const clean = window.location.pathname.replace(/\.html$/, '');
      window.history.replaceState(null, '', clean + window.location.hash);
    }
  }, []);

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
        <h1>A record of every action</h1>
        <div className="feature-hero-actions">
          <a className="scratch-primary" href="#contact">Book a demo</a>
          <a className="scratch-secondary" href="/#how">See it resolve a request</a>
        </div>
      </section>

      <section className="audit-showcase" aria-label="Audit log">
        <div className="device-window audit-window">
          <div className="device-window-bar">
            <div className="audit-toolbtns">
              <button type="button" className="audit-toolbtn">
                <svg viewBox="0 0 20 20"><rect x="4.5" y="9" width="11" height="7.5" rx="2" /><path d="M7 9V6.4a3 3 0 0 1 6 0V9" /></svg>
                Immutable
              </button>
              <button type="button" className="audit-toolbtn">
                <svg viewBox="0 0 20 20"><path d="M10 3v9m0 0 3-3m-3 3-3-3" /><path d="M4 14v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" /></svg>
                Exportable
              </button>
            </div>
            <div className="device-window-actions">
              <span className="idv-secure"><svg viewBox="0 0 20 20"><rect x="4.5" y="9" width="11" height="7.5" rx="2" /><path d="M7 9V6.4a3 3 0 0 1 6 0V9" /></svg> Append-only</span>
            </div>
          </div>
          <div className="audit-log">
            {entries.map((entry) => (
              <div className="audit-log-row" key={entry.action}>
                <span className="audit-log-check"><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg></span>
                <span className="audit-log-main"><b>{entry.action}</b><small>{entry.detail}</small></span>
                <span className={`audit-log-kind is-${entry.kind}`}>{kindLabel[entry.kind]}</span>
                <span className="audit-log-time">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-caps" aria-label="Why the audit log matters">
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

      <section className="feature-caps" aria-label="What every entry captures">
        <h2 className="feature-caps-title">Captured on every line</h2>
        <div className="device-list-grid">
          {captured.map(([icon, label]) => (
            <div className="device-list-cell" key={label}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{captureIcons[icon]}</svg>
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
