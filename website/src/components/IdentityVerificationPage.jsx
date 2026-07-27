import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScratchNav from './ScratchNav.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';
import { IdentityVerify, AuditTrail } from './BentoVisuals.jsx';

gsap.registerPlugin(ScrollToPlugin);

// Hero focus: a verification console. A requester on the left, the identity
// checks resolving to "verified" on the right, with the fingerprint scan.
function VerificationConsole() {
  const steps = [
    'Matched in Microsoft Entra ID',
    'MFA push approved',
    'Device NEV-LT-042 trusted',
    'No risk signals',
  ];
  return (
    <div className="device-window idv-window">
      <div className="device-window-bar">
        <div className="device-window-brand">
          <span>Verification</span>
        </div>
        <div className="device-window-title">Request · <b>#4821</b></div>
        <div className="device-window-actions">
          <span className="idv-secure"><svg viewBox="0 0 20 20"><rect x="4.5" y="9" width="11" height="7.5" rx="2" /><path d="M7 9V6.4a3 3 0 0 1 6 0V9" /></svg> Secure</span>
        </div>
      </div>
      <div className="idv-window-body">
        <div className="idv-req">
          <div className="idv-req-user">
            <span className="idv-req-avatar"><img src="/assets/female.jpg" alt="" /></span>
            <div><b>Jordan Lee</b><small>Sales · Finance apps</small></div>
          </div>
          <div className="idv-req-ask">
            <span className="idv-req-label">Requesting</span>
            <span className="idv-req-value">Password reset · finance portal</span>
          </div>
          <div className="idv-req-meta">
            <span><svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 3z" /></svg> via support chat</span>
            <span><svg viewBox="0 0 24 24"><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg> your-company.nevian.com</span>
          </div>
        </div>
        <div className="idv-check">
          <IdentityVerify />
          <ul className="idv-steps">
            {steps.map((step) => (
              <li key={step}>
                <span className="idv-steps-check"><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg></span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Step-up MFA push notification.
function StepUpPush() {
  return (
    <div className="idv-push" aria-hidden="true">
      <div className="idv-push-card">
        <div className="idv-push-head">
          <span className="idv-push-mark"><img src="/assets/logo.png" alt="" /></span>
          <div className="idv-push-id"><b>Approve sign-in?</b><small>Nevian · Finance portal</small></div>
        </div>
        <div className="idv-push-meta">NEV-LT-042 · Warsaw, PL · just now</div>
        <div className="idv-push-actions">
          <span className="idv-push-deny">Deny</span>
          <span className="idv-push-approve">Approve</span>
        </div>
      </div>
    </div>
  );
}

// Directory record match against the identity provider.
function DirectoryMatch() {
  const rows = [
    ['Account', 'jordan.lee@acme.com'],
    ['Status', 'Active'],
    ['Group', 'Finance'],
    ['MFA', 'Enabled'],
  ];
  return (
    <div className="idv-dir" aria-hidden="true">
      <div className="idv-dir-provider">
        <img src="/assets/integrations/azure-active-directory.svg" alt="" />
        Microsoft Entra ID
      </div>
      <ul>
        {rows.map(([label, value]) => (
          <li key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <i><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg></i>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Manager approval step for higher-risk requests.
function ApprovalStep() {
  return (
    <div className="idv-approval" aria-hidden="true">
      <div className="idv-approval-line">Grant admin access · <b>billing server</b></div>
      <div className="idv-approval-card">
        <span className="idv-approval-avatar"><img src="/assets/male.jpg" alt="" /></span>
        <span className="idv-approval-meta">
          <b>Priya Raman</b>
          <small>Manager · approval required</small>
        </span>
        <span className="idv-approval-status">Pending</span>
      </div>
    </div>
  );
}

// A held request flagged by risk signals.
function RiskBlock() {
  const flags = ['Device not recognized', 'Impossible travel', 'Out-of-policy request'];
  return (
    <div className="idv-risk" aria-hidden="true">
      <div className="idv-risk-head">
        <span className="idv-risk-badge"><svg viewBox="0 0 24 24"><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg> Held for review</span>
      </div>
      <ul>
        {flags.map((flag) => (
          <li key={flag}><i /> {flag}</li>
        ))}
      </ul>
    </div>
  );
}

const featurePanels = [
  {
    key: 'stepup',
    span: 'wide',
    visual: <StepUpPush />,
    title: 'Step-up verification, built in.',
    body: 'Nevian asks for proof before it does anything sensitive: a push to the registered device, a one-time code, or a fresh MFA challenge, chosen to match the risk of the request.',
  },
  {
    key: 'directory',
    visual: <DirectoryMatch />,
    title: 'Matched against your directory.',
    body: 'Every requester is checked in Microsoft Entra ID or your identity provider, so the account, status, and group line up before anything happens.',
  },
  {
    key: 'approval',
    visual: <ApprovalStep />,
    title: 'Send it to an approver when it matters.',
    body: 'High-risk requests can require a manager or resource owner to sign off first, right inside the conversation.',
  },
  {
    key: 'risk',
    visual: <RiskBlock />,
    title: 'Social engineering stops at the door.',
    body: 'Mismatched devices, impossible travel, and out-of-policy asks are flagged and held for a human instead of quietly resolved.',
  },
  {
    key: 'audit',
    visual: <AuditTrail />,
    title: 'Proof, on the record.',
    body: 'Who was verified, how, and what happened next is written to the audit log for every request.',
  },
];

// Compact "ways Nevian verifies" grid (reuses the device-list styling).
const listIcons = {
  push: <><rect x="7" y="3" width="10" height="18" rx="2.4" /><path d="M11 18h2" /></>,
  code: <><path d="M9 4l-2 16M17 4l-2 16M4 9h16M3 15h16" /></>,
  key: <><circle cx="8" cy="8" r="4" /><path d="M11 11l8 8M16 16l2-2M18.5 18.5l1.5-1.5" /></>,
  badge: <><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="12" cy="10" r="2.4" /><path d="M8.5 16.5a3.5 3.5 0 0 1 7 0" /></>,
  approve: <><circle cx="10" cy="8" r="3.2" /><path d="M4.5 20a5.5 5.5 0 0 1 11 0" /><path d="M15 13l2 2 4-4" /></>,
  device: <><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M8 20h8M12 16.5V20" /><path d="M9 10.5l2 2 4-4" /></>,
  risk: <><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></>,
  shield: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></>,
  sso: <><path d="M9 12a3 3 0 0 1 3-3h4a3 3 0 0 1 0 6h-2" /><path d="M15 12a3 3 0 0 1-3 3H8a3 3 0 0 1 0-6h2" /></>,
  log: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
};

const listItems = [
  ['push', 'MFA push'],
  ['code', 'One-time code'],
  ['key', 'Passkeys'],
  ['badge', 'Microsoft Entra ID'],
  ['approve', 'Manager approval'],
  ['device', 'Device trust'],
  ['risk', 'Risk signals'],
  ['shield', 'Step-up challenge'],
  ['sso', 'SSO session'],
  ['log', 'Audit log'],
];

export default function IdentityVerificationPage() {
  // Clean "/identity-verification" in the address bar.
  useEffect(() => {
    if (window.location.pathname.endsWith('/identity-verification.html')) {
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
    <main className="scratch-page feature-page device-page">
      <ScratchNav />

      <section className="feature-hero">
        <a className="feature-eyebrow" href="/">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" /></svg>
          Home
        </a>
        <h1>Verify who&apos;s asking,<br />before you act</h1>
        <div className="feature-hero-actions">
          <a className="scratch-primary" href="#contact">Book a demo</a>
          <a className="scratch-secondary" href="/#how">See it resolve a request</a>
        </div>
      </section>

      <section className="device-showcase idv-showcase" aria-label="Identity verification console">
        <VerificationConsole />
      </section>

      <section className="feature-bento" aria-label="How Nevian confirms identity">
        <h2 className="feature-caps-title feature-bento-title">Trust, before any action</h2>
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

      <section className="feature-caps" aria-label="Ways Nevian verifies identity">
        <h2 className="feature-caps-title">The ways Nevian verifies</h2>
        <div className="device-list-grid">
          {listItems.map(([icon, label]) => (
            <div className="device-list-cell" key={label}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{listIcons[icon]}</svg>
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
