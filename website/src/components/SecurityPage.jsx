import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScratchNav from './ScratchNav.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';
import { SecurityBar } from './BentoVisuals.jsx';

gsap.registerPlugin(ScrollToPlugin);

// A small monospace code chip, like Framer's inline `AES-256` / `TLS 1.3` pills.
function Chip({ children }) {
  return <code className="sec-chip">{children}</code>;
}

// The signature "built into every layer" grid: 2 columns × 3 rows of connected
// cells, each an icon, a title (optionally a link to a related page), a short
// body, and inline code chips for the concrete primitives.
const layers = [
  {
    icon: <path d="M12 3 5 6v5c0 4.6 2.9 8 7 10 4.1-2 7-5.4 7-10V6l-7-3Z" />,
    title: 'Least privilege by default',
    body: (
      <>
        Every automated action runs with the minimum scope it needs and nothing
        more. Agents hold no standing admin rights, so a request can only touch
        what it was <Chip>RBAC</Chip>-scoped to.
      </>
    ),
  },
  {
    icon: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></>,
    title: 'Signed, verified agents',
    body: (
      <>
        The Desk and Server Agents only execute code-signed, approved scripts.
        Anything unsigned is rejected before it can run, verified with{' '}
        <Chip>Ed25519</Chip> and <Chip>SHA-256</Chip>.
      </>
    ),
  },
  {
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
    title: 'Encrypted end to end',
    body: (
      <>
        Context in transit and state at rest are encrypted at all times. No plain
        traffic ever leaves your environment: <Chip>TLS 1.3</Chip> on the wire,{' '}
        <Chip>AES-256</Chip> at rest.
      </>
    ),
  },
  {
    icon: <><circle cx="12" cy="12" r="9" /><path d="M9.5 12l1.8 1.8L15 10" /></>,
    title: 'Enterprise compliance',
    body: (
      <>
        Aligned with the frameworks your auditors already ask for, out of the box:{' '}
        <Chip>SOC 2</Chip>, <Chip>ISO 27001</Chip>, and <Chip>GDPR</Chip> with data
        residency you control.
      </>
    ),
  },
  {
    icon: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    title: 'Approvals & step-up auth',
    href: '/identity-verification.html',
    body: (
      <>
        Sensitive actions pause for a human decision and re-verified identity
        before anything happens. Nothing privileged runs without{' '}
        <Chip>MFA</Chip> and an <Chip>approval</Chip>.
      </>
    ),
  },
  {
    icon: <><path d="m13.5 2-7 10H12l-1.5 10 7-11H12l1.5-9Z" /></>,
    title: 'Immutable audit trail',
    href: '/audit-trail.html',
    body: (
      <>
        Every action is written append-only: who, what, which device, and the
        result. Nothing can be quietly edited, and it can stream to your{' '}
        <Chip>SIEM</Chip> on demand.
      </>
    ),
  },
];

// Compact controls grid (icon + label), reusing the site's device-list style.
const controlIcons = {
  sso: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5M15 12H3" /></>,
  scim: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 8a3 3 0 0 1 0 6M21 19a5 5 0 0 0-4-4.9" /></>,
  outbound: <><rect x="4" y="4" width="16" height="7" rx="1.6" /><rect x="4" y="13" width="16" height="7" rx="1.6" /><path d="M7.5 7.5h.01M7.5 16.5h.01" /></>,
  keys: <><circle cx="8" cy="8" r="4" /><path d="M11 11l8 8M16 16l2-2M18.5 18.5l1.5-1.5" /></>,
  session: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  ratelimit: <path d="m13.5 2-7 10H12l-1.5 10 7-11H12l1.5-9Z" />,
  residency: <><path d="M12 3 4 7l8 4 8-4-8-4Z" /><path d="M4 12l8 4 8-4M4 17l8 4 8-4" /></>,
  redaction: <><path d="M4 6h16M4 12h10M4 18h16" /><path d="M17 10l4 4m0-4-4 4" /></>,
  ssl: <><rect x="4.5" y="9" width="11" height="7.5" rx="2" transform="translate(2 0)" /><path d="M9 9V6.4a3 3 0 0 1 6 0V9" /></>,
  isolation: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
};
const controls = [
  ['sso', 'SSO / SAML'],
  ['scim', 'SCIM provisioning'],
  ['outbound', 'Outbound-only gateway'],
  ['keys', 'Customer-managed keys'],
  ['session', 'Session controls'],
  ['ratelimit', 'Rate limiting'],
  ['residency', 'Data residency'],
  ['redaction', 'PII redaction'],
  ['ssl', 'Automated TLS'],
  ['isolation', 'Tenant isolation'],
];

const faqs = [
  {
    q: 'Does Nevian ever hold standing access to our systems?',
    a: 'No. Agents run with no standing admin rights. Each action is granted a scoped, short-lived credential for exactly what it needs, then that grant expires. Access is never left open between requests.',
  },
  {
    q: 'How do you keep an automated action from doing something it shouldn’t?',
    a: 'Every action is checked against your policy before it runs, and only code-signed, approved scripts execute. Anything sensitive pauses for human approval and re-verified identity first, and the whole decision is written to the audit log.',
  },
  {
    q: 'Do you require inbound network access to our environment?',
    a: 'No. The Agent Gateway is outbound-only, so there are no inbound ports to open or firewall holes to manage. Context and approved jobs flow over a single encrypted channel your team controls.',
  },
  {
    q: 'Where is our data stored, and who can see it?',
    a: 'Context and state are encrypted in transit and at rest, with data residency you choose. Access is role-based, and every read or action is recorded in the immutable audit trail you can export at any time.',
  },
  {
    q: 'Which compliance frameworks do you support?',
    a: 'Nevian is aligned with SOC 2 Type II, ISO 27001, GDPR, and CCPA. We can share our reports and answer security questionnaires under NDA. Reach out to our team to get started.',
  },
];

export default function SecurityPage() {
  // Clean "/security" in the address bar.
  useEffect(() => {
    if (window.location.pathname.endsWith('/security.html')) {
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
        <h1>Security built<br />into every layer</h1>
        <p>Nevian acts inside your environment, so every action is scoped, verified, and recorded. Automation without handing over the keys.</p>
        <div className="feature-hero-actions">
          <a className="scratch-primary" href="#contact">Talk to our team</a>
          <a className="scratch-secondary" href="/#how">See it resolve a request</a>
        </div>
      </section>

      <section className="sec-layers" aria-label="How Nevian secures every layer">
        <div className="sec-layer-grid">
          {layers.map((layer) => (
            <article className="sec-layer" key={layer.title}>
              <svg className="sec-layer-icon" viewBox="0 0 24 24" aria-hidden="true">{layer.icon}</svg>
              <h3>
                {layer.href ? (
                  <a href={layer.href}>{layer.title}
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>
                  </a>
                ) : layer.title}
              </h3>
              <p>{layer.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sec-showcase" aria-label="Every session on a verified connection">
        <div className="sec-showcase-copy">
          <h2 className="feature-caps-title">Secure by default,<br />end to end</h2>
          <p>From the browser to the endpoint, connections are verified and encrypted before any work happens. There is nothing to configure and no certificate to renew.</p>
        </div>
        <div className="sec-showcase-visual"><SecurityBar /></div>
      </section>

      <section className="feature-caps" aria-label="Security controls across the stack">
        <h2 className="feature-caps-title">Controls across the stack</h2>
        <div className="device-list-grid">
          {controls.map(([icon, label]) => (
            <div className="device-list-cell" key={label}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{controlIcons[icon]}</svg>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sec-faq" aria-label="Frequently asked questions">
        <h2 className="feature-caps-title">Frequently asked<br />questions</h2>
        <div className="sec-faq-list">
          {faqs.map((item) => (
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
