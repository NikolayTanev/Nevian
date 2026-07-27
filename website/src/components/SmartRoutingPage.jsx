import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScratchNav from './ScratchNav.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';
import Architecture from './Architecture.jsx';
import { AuditTrail } from './BentoVisuals.jsx';

gsap.registerPlugin(ScrollToPlugin);

// A request being read, classified, and pointed at the right place.
function RouteClassify() {
  const tags = [['Category', 'Access'], ['Intent', 'Grant access'], ['Priority', 'Normal']];
  return (
    <div className="rt-classify" aria-hidden="true">
      <div className="rt-classify-req">
        <span className="rt-classify-quote">“</span>
        <div>
          <b>Approve VPN access to the finance app</b>
          <small>Jordan Lee · via support chat</small>
        </div>
      </div>
      <div className="rt-classify-tags">
        {tags.map(([label, value]) => (
          <span className="rt-classify-tag" key={label}><em>{label}</em>{value}</span>
        ))}
        <span className="rt-classify-conf">98% confidence</span>
      </div>
      <div className="rt-classify-route">
        <svg viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4" /></svg>
        Routed to <b>Desk Agent</b>
      </div>
    </div>
  );
}

// The specialist destinations a request can be sent to.
function AgentRoster() {
  const agents = [
    ['Desk Agent', 'Access, resets, software'],
    ['Server Agent', 'Infrastructure and services'],
    ['Auto-resolve', 'Known, safe fixes'],
    ['Human handoff', 'Everything else'],
  ];
  return (
    <div className="rt-agents" aria-hidden="true">
      {agents.map(([name, handles]) => (
        <div className="rt-agent" key={name}>
          <span className="rt-agent-dot" />
          <span className="rt-agent-meta"><b>{name}</b><small>{handles}</small></span>
        </div>
      ))}
    </div>
  );
}

// The context sources routing draws on.
function SourceContext() {
  const sources = ['Device context', 'Knowledge base', 'Identity', 'Infrastructure', 'Integrations'];
  return (
    <div className="rt-sources" aria-hidden="true">
      {sources.map((source) => (
        <span className="rt-source" key={source}><i /> {source}</span>
      ))}
    </div>
  );
}

// Urgency changes where a request goes and how fast.
function RoutePriority() {
  const rows = [
    ['Server down · billing', 'Urgent', 'urgent'],
    ['Password reset', 'Normal', 'normal'],
    ['New laptop setup', 'Low', 'low'],
  ];
  return (
    <div className="rt-priority" aria-hidden="true">
      {rows.map(([label, tag, kind]) => (
        <div className="rt-priority-row" key={label}>
          <span className={`rt-priority-badge is-${kind}`}>{tag}</span>
          <span className="rt-priority-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

const featurePanels = [
  {
    key: 'classify',
    span: 'wide',
    visual: <RouteClassify />,
    title: 'Every request is understood before it moves.',
    body: 'Nevian reads the request, works out the intent and category, and sends it to the right place. No manual triage, no shared inbox to pick through.',
  },
  {
    key: 'agents',
    visual: <AgentRoster />,
    title: 'Sent to the right specialist.',
    body: 'Access and resets go to the desk agent, infrastructure work to the server agent, and known fixes resolve on their own.',
  },
  {
    key: 'sources',
    visual: <SourceContext />,
    title: 'Grounded in your own context.',
    body: 'Routing draws on device context, your knowledge base, identity, and connected tools, so decisions fit your environment.',
  },
  {
    key: 'priority',
    visual: <RoutePriority />,
    title: 'Urgency changes the route.',
    body: 'A downed server jumps ahead and goes straight to the right agent, while routine asks flow through the normal path.',
  },
  {
    key: 'audit',
    visual: <AuditTrail />,
    title: 'Every routing decision, on the record.',
    body: 'What was routed where, and why, is written to the audit log.',
  },
];

const listIcons = {
  desk: <><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M9 20h6m-3-3.5V20" /></>,
  server: <><rect x="4" y="4" width="16" height="7" rx="1.6" /><rect x="4" y="13" width="16" height="7" rx="1.6" /><path d="M7.5 7.5h.01M7.5 16.5h.01" /></>,
  identity: <><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
  network: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  access: <><circle cx="8" cy="8" r="4" /><path d="M11 11l8 8M16 16l2-2M18.5 18.5l1.5-1.5" /></>,
  software: <><path d="M12 3v11m0 0 4-4m-4 4-4-4" /><path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" /></>,
  auto: <path d="M4 12l5 5L20 6" />,
  human: <><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /><path d="M18 4v4M20 6h-4" /></>,
  kb: <><path d="M6 4h9a1 1 0 0 1 1 1v15H8a2 2 0 0 0-2 2V4Z" /><path d="M16 5h2a1 1 0 0 1 1 1v14" /></>,
  infra: <><path d="M12 3 4 7l8 4 8-4-8-4Z" /><path d="M4 12l8 4 8-4M4 17l8 4 8-4" /></>,
};

const listItems = [
  ['desk', 'Desk Agent'],
  ['server', 'Server Agent'],
  ['auto', 'Auto-resolve'],
  ['human', 'Human handoff'],
  ['access', 'Access requests'],
  ['software', 'Software installs'],
  ['identity', 'Identity tasks'],
  ['network', 'Network issues'],
  ['kb', 'Knowledge base'],
  ['infra', 'Infrastructure'],
];

export default function SmartRoutingPage() {
  // Clean "/smart-routing" in the address bar.
  useEffect(() => {
    if (window.location.pathname.endsWith('/smart-routing.html')) {
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
        <h1>Every request, routed<br />to the right place</h1>
        <div className="feature-hero-actions">
          <a className="scratch-primary" href="#contact">Book a demo</a>
          <a className="scratch-secondary" href="/#how">See it resolve a request</a>
        </div>
      </section>

      <Architecture />

      <section className="feature-bento" aria-label="How Nevian routes requests">
        <h2 className="feature-caps-title feature-bento-title">From request to resolution</h2>
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

      <section className="feature-caps" aria-label="Where requests can go">
        <h2 className="feature-caps-title">Where requests can go</h2>
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
