import { useState } from 'react';
import { IconArrow, IconCheck } from './Icons.jsx';

const tickets = [
  {
    id: 't1',
    tkt: 'TKT-0042',
    title: 'I forgot my password',
    tag: 'resolved',
    convoTitle: 'Password reset',
    msgs: [
      { role: 'user', text: "I'm locked out and forgot my password." },
      { role: 'ai', text: "I can reset it for you. What's the 6-digit code from your authenticator app?" },
      { role: 'user', text: '482 913' },
      { role: 'ai', text: "Verified. Here's a temporary password: ", code: 'Tq7$kR2wze', tail: ". You'll choose a new one when you next sign in." },
    ],
    sys: { kind: 'green', text: 'Resolved automatically in 1.4 seconds' },
  },
  {
    id: 't2',
    tkt: 'TKT-0043',
    title: 'Software request',
    tag: 'resolved',
    convoTitle: 'Software request',
    msgs: [
      { role: 'user', text: 'I need Acrobat Pro installed for a project.' },
      { role: 'ai', text: "You're covered under the company license. Which device should I install it on?" },
      { role: 'user', text: 'My work laptop, LATITUDE-5430-01.' },
      { role: 'ai', text: "Installing now through the desk agent. I'll confirm when it's ready." },
      { role: 'ai', text: 'All set. Acrobat Pro is installed and ready to use.' },
    ],
    sys: { kind: 'green', text: 'Resolved automatically with no waiting' },
  },
  {
    id: 't3',
    tkt: 'TKT-0044',
    title: 'Laptop keeps crashing',
    tag: 'escalated',
    convoTitle: 'Laptop keeps crashing',
    msgs: [
      { role: 'user', text: 'My laptop keeps crashing with a blue screen.' },
      { role: 'ai', text: "I checked your device and I'm seeing repeated crashes after a recent graphics driver update." },
      { role: 'ai', text: "This needs a technician, so I've passed it on with your logs and device details attached." },
    ],
    sys: { kind: 'amber', text: 'Escalated to second line support and assigned to Alex R.' },
  },
  {
    id: 't4',
    tkt: 'TKT-0045',
    title: "VPN won't connect",
    tag: 'resolved',
    convoTitle: "VPN won't connect",
    msgs: [
      { role: 'user', text: "I can't connect to the VPN from home." },
      { role: 'ai', text: 'Your VPN client is a few versions behind. Want me to update it on your laptop?' },
      { role: 'user', text: 'Yes, go ahead.' },
      { role: 'ai', text: "Updated and reconnected. You're on the VPN now." },
    ],
    sys: { kind: 'green', text: 'Resolved automatically with no waiting' },
  },
];

function Tag({ tag }) {
  const green = tag === 'resolved';
  return (
    <span className={`hero-demo-tag ${green ? 'is-resolved' : 'is-escalated'}`}>
      {green ? 'Resolved' : 'Escalated'}
    </span>
  );
}

function HeroContextField({ className }) {
  return (
    <div aria-hidden="true" className={`hero-context-field ${className}`}>
      <div className="hero-context-canvas">
        <svg className="hero-context-links" viewBox="0 0 1000 520" preserveAspectRatio="none">
          <path d="M92 190 C250 190 290 258 442 258" />
          <path d="M908 170 C748 170 716 258 558 258" />
          <path d="M150 420 C292 420 330 300 448 282" />
          <path d="M850 416 C708 416 666 302 552 282" />
          <path d="M500 82 L500 438" />
          <circle cx="500" cy="270" r="7" />
          <circle cx="442" cy="258" r="3" />
          <circle cx="558" cy="258" r="3" />
        </svg>

        <article className="hero-context-node hero-context-request">
          <div className="hero-context-node-head">
            <span>Incoming request</span>
            <b>TKT-0044</b>
          </div>
          <strong>Laptop keeps crashing</strong>
          <p>Crash history and recent changes found</p>
          <div className="hero-context-tags">
            <i>Device linked</i>
            <i>Logs attached</i>
          </div>
        </article>

        <article className="hero-context-node hero-context-device">
          <div className="hero-context-node-head">
            <span>Device context</span>
            <b>Live</b>
          </div>
          <dl>
            <div><dt>Device</dt><dd>LATITUDE-5430-01</dd></div>
            <div><dt>OS</dt><dd>Windows 11</dd></div>
            <div><dt>Health</dt><dd className="is-warning">Needs attention</dd></div>
          </dl>
        </article>

        <article className="hero-context-node hero-context-signal">
          <div className="hero-context-node-head">
            <span>Signal detected</span>
            <b>09:42</b>
          </div>
          <strong>Graphics driver changed</strong>
          <div className="hero-context-wave" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i /><i />
          </div>
        </article>

        <article className="hero-context-node hero-context-outcome">
          <span className="hero-context-check"><IconCheck /></span>
          <div>
            <span>Context assembled</span>
            <strong>Ready for second line</strong>
            <small>Assigned with evidence attached</small>
          </div>
        </article>
      </div>
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState('t1');
  const current = tickets.find((t) => t.id === active);

  const moveSpotlight = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const hero = event.currentTarget.closest('.hero-section');
    const heroBounds = hero?.getBoundingClientRect();
    const main = event.currentTarget.closest('main');
    event.currentTarget.style.setProperty('--hero-spotlight-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--hero-spotlight-y', `${event.clientY - bounds.top}px`);
    main?.style.setProperty('--hero-transition-x', `${event.clientX}px`);
    if (hero && heroBounds) {
      hero.style.setProperty('--hero-light-x', `${event.clientX - heroBounds.left}px`);
      hero.style.setProperty('--hero-light-y', `${event.clientY - heroBounds.top}px`);
    }
  };

  return (
    <section id="top" className="hero-section">
      {/* Full-bleed artwork across the complete hero. */}
      <div aria-hidden="true" className="hero-background" />
      {/* The artwork dissolves directly into the following dark section. */}
      <div aria-hidden="true" className="hero-section-fade" />

      <div
        className="hero-content wrap"
        onPointerEnter={moveSpotlight}
        onPointerMove={moveSpotlight}
      >
        <HeroContextField className="hero-context-field-ambient" />
        <HeroContextField className="hero-context-field-spotlight" />

        {/* Headline + CTAs, centered */}
        <div className="hero-copy hero-enter">
          <h1>
            Give every IT request the context it needs.
          </h1>
          <p>Nevian handles common requests, gathers device details, and shows your team exactly what happened.</p>
          <div className="hero-actions">
            <a href="/contact.html" className="hero-button hero-button-primary">Book a demo</a>
            <a href="#how" className="hero-button hero-button-secondary">
              See how it works <IconArrow className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Interactive help-desk preview */}
        <div
          className="hero-demo-wrap hero-enter hero-enter-late"
          onPointerEnter={moveSpotlight}
          onPointerMove={moveSpotlight}
        >
          <div className="hero-demo-shell">
            {/* chrome bar */}
            <div className="hero-demo-chrome">
              <span className="hero-demo-controls" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="hero-demo-title"><img src="/assets/logo.png" alt="" /> Nevian <i /> Help desk</span>
              <a href="/contact.html" className="hero-demo-link">Open workspace <IconArrow className="h-3.5 w-3.5" /></a>
            </div>

            {/* body */}
            <div className="hero-demo-body">
              {/* sidebar */}
              <aside className="hero-demo-sidebar" role="tablist" aria-label="Example tickets">
                <div className="hero-demo-sidebar-label">Your requests</div>
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active === t.id}
                    onClick={() => setActive(t.id)}
                    className={`hero-ticket ${active === t.id ? 'is-active' : ''}`}
                  >
                    <span className="hero-ticket-meta">
                      <span>{t.tkt}</span>
                      <Tag tag={t.tag} />
                    </span>
                    <span className="hero-ticket-title">{t.title}</span>
                  </button>
                ))}
              </aside>

              {/* conversation */}
              <div className="hero-demo-conversation">
                <div key={current.id} className="hero-conversation-scene">
                  <div className="hero-conversation-header">
                    <span>{current.convoTitle}</span>
                    <Tag tag={current.tag} />
                  </div>
                  <div className="hero-messages">
                    {current.msgs.map((m, i) =>
                      m.role === 'user' ? (
                        <div key={i} className="hero-message hero-message-user">
                          {m.text}
                        </div>
                      ) : (
                        <div key={i} className="hero-message hero-message-agent">
                          {m.text}
                          {m.code && <code>{m.code}</code>}
                          {m.tail}
                        </div>
                      )
                    )}
                    <div
                      className={`hero-system-message ${current.sys.kind === 'green' ? 'is-green' : 'is-amber'}`}
                    >
                      {current.sys.kind === 'green' ? (
                        <IconCheck className="h-4 w-4" />
                      ) : (
                        <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 5.5v3M8 11h.01M8 2 1.5 13.5h13z" /></svg>
                      )}
                      {current.sys.text}
                    </div>
                  </div>
                </div>

                {/* composer */}
                <div className="hero-composer">
                  <span>Message the help desk…</span>
                  <span className="hero-composer-send">
                    <IconArrow className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
