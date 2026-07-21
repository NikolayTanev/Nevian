import { useRef, useState } from 'react';
import { IconArrow, IconCheck, IconChat, IconDevice, IconBolt } from './Icons.jsx';
import HeroFlowLines from './HeroFlowLines.jsx';

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

const heroProductCards = [
  {
    key: 'request',
    tab: 'Request',
    icon: <IconChat />,
    label: 'Request intake',
    status: 'Matched',
    title: 'Understand the request before it hits the queue.',
    description: 'Nevian connects the person, device, and intent while the conversation is still happening.',
    bullets: ['Identity verified', 'Managed device linked'],
    href: '#how',
  },
  {
    key: 'device',
    tab: 'Context',
    icon: <IconDevice />,
    label: 'Device context',
    status: 'Live',
    title: 'Bring the device state into the conversation.',
    description: 'Health, management, and recent activity arrive together instead of being gathered by hand.',
    bullets: ['Entra and Intune matched', 'Recent failures surfaced'],
    href: '#features',
  },
  {
    key: 'evidence',
    tab: 'Evidence',
    icon: <IconBolt />,
    label: 'Change correlation',
    status: '3 signals',
    title: 'Find the change behind the issue.',
    description: 'A clear timeline connects the first failure to the driver update that happened just before it.',
    bullets: ['Crash window compared', 'Likely cause highlighted'],
    href: '#how',
  },
  {
    key: 'handoff',
    tab: 'Handoff',
    icon: <IconArrow />,
    label: 'Resolution brief',
    status: 'Ready',
    title: 'Give second line a ready-to-use brief.',
    description: 'The right team receives the summary, evidence, and ownership without repeating the investigation.',
    bullets: ['Six evidence items attached', 'EUC support assigned'],
    href: '/contact.html',
  },
];

function HeroProductVisual({ kind }) {
  if (kind === 'request') {
    return (
      <div className="hero-stack-scene hero-stack-scene-request">
        <div className="hero-stack-ticket-head"><span><i /> New request</span><b>TKT-0044</b></div>
        <div className="hero-stack-ticket-main">
          <span>LM</span>
          <div><small>Linda M. · Finance</small><strong>Laptop crashes after sign-in</strong></div>
        </div>
        <div className="hero-stack-ticket-signals"><span>Identity</span><i /><span>Device</span><i /><span>Recent activity</span></div>
      </div>
    );
  }

  if (kind === 'device') {
    return (
      <div className="hero-stack-scene hero-stack-scene-device">
        <span className="hero-stack-context-chip is-identity">Entra matched</span>
        <span className="hero-stack-context-chip is-health">2 failures</span>
        <span className="hero-stack-context-chip is-checkin">38 sec ago</span>
        <span className="hero-stack-context-chip is-compliance">Compliant</span>
        <div className="hero-stack-device-core"><i /><strong>LATITUDE-5430</strong><small>Windows 11 · Managed</small></div>
      </div>
    );
  }

  if (kind === 'evidence') {
    return (
      <div className="hero-stack-scene hero-stack-scene-evidence">
        <div className="hero-stack-evidence-title"><small>Crash window</small><strong>Driver update found 18 minutes earlier</strong></div>
        <div className="hero-stack-evidence-track"><span /><span /><span className="is-change" /><span /><span className="is-crash" /></div>
        <div className="hero-stack-evidence-labels"><span>09:24 · Driver changed</span><span>09:42 · First crash</span></div>
      </div>
    );
  }

  return (
    <div className="hero-stack-scene hero-stack-scene-handoff">
      <div className="hero-stack-ready-mark"><span><IconCheck /></span></div>
      <div className="hero-stack-ready-copy"><strong>Evidence package complete</strong><small>Everything second line needs, attached once.</small></div>
      <div className="hero-stack-ready-rows"><span><i />Crash logs</span><span><i />Device state</span><span><i />Change timeline</span></div>
    </div>
  );
}

// Pointer must travel this many px INTO a collapsed bar before it opens, so a
// glancing edge-graze does not switch cards.
const INTENT_TRAVEL = 8;
// After a switch, ignore hover activations briefly so a single stray drift can
// not skip you past the next card.
const SWITCH_LOCKOUT_MS = 220;

function HeroProductStack() {
  const [activeCard, setActiveCard] = useState(1);
  const lockUntilRef = useRef(0);
  const enterInfoRef = useRef(null);

  const activateCard = (index, { immediate = false } = {}) => {
    if (!immediate && performance.now() < lockUntilRef.current) return;
    setActiveCard((prev) => {
      if (prev === index) return prev;
      // Lock out further hover switches for a beat after this one lands.
      lockUntilRef.current = performance.now() + SWITCH_LOCKOUT_MS;
      return index;
    });
  };

  // Record where the pointer entered a collapsed bar.
  const handleBarEnter = (index, event) => {
    enterInfoRef.current = { index, x: event.clientX };
  };

  // Only open once the pointer has moved a deliberate distance into the bar.
  const handleBarMove = (index, event) => {
    if (index === activeCard) return;
    const info = enterInfoRef.current;
    if (!info || info.index !== index) {
      enterInfoRef.current = { index, x: event.clientX };
      return;
    }
    if (Math.abs(event.clientX - info.x) >= INTENT_TRAVEL) {
      activateCard(index);
    }
  };

  const clearIntent = () => {
    enterInfoRef.current = null;
  };

  return (
    <div
      className="hero-product-stack"
      aria-label="Nevian product workflow"
      onPointerLeave={clearIntent}
    >
      {heroProductCards.map((card, index) => {
        const isActive = activeCard === index;
        const distance = Math.abs(index - activeCard);
        const side = index < activeCard ? 'left' : 'right';

        return (
          <article
            className={`hero-product-card ${isActive ? 'is-active' : 'is-collapsed'}`}
            data-side={side}
            key={card.key}
            style={{
              '--card-z': `${-26 - distance * 18}px`,
              zIndex: isActive ? 8 : 7 - distance,
            }}
            onPointerEnter={(event) => handleBarEnter(index, event)}
            onPointerMove={(event) => handleBarMove(index, event)}
          >
            <button
              type="button"
              className="hero-product-tab"
              aria-label={`Open ${card.tab}`}
              aria-hidden={isActive}
              tabIndex={isActive ? -1 : 0}
              onFocus={() => activateCard(index, { immediate: true })}
              onClick={() => activateCard(index, { immediate: true })}
            >
              <span className="hero-product-tab-icon" aria-hidden="true">{card.icon}</span>
              <span>{card.tab}</span>
            </button>

            <div className="hero-product-card-content" aria-hidden={!isActive}>
              <div className="hero-product-card-topline">
                <span><i />{card.label}</span>
                <b>{card.status}</b>
              </div>
              <div className="hero-product-visual"><HeroProductVisual kind={card.key} /></div>
              <div className="hero-product-card-body">
                <div className="hero-product-card-copy"><h2>{card.title}</h2><p>{card.description}</p></div>
                <div className="hero-product-card-actions">
                  <ul>{card.bullets.map((bullet) => <li key={bullet}><IconCheck />{bullet}</li>)}</ul>
                  <a href={card.href} tabIndex={isActive ? 0 : -1}>Explore <IconArrow /></a>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState('t1');
  const current = tickets.find((t) => t.id === active);

  return (
    <section id="top" className="hero-section">
      {/* Full-bleed artwork across the complete hero. */}
      <div aria-hidden="true" className="hero-background" />
      {/* One continuous line rises from the logo seam, bends, and branches. */}
      <HeroFlowLines />
      {/* The artwork dissolves directly into the following dark section. */}
      <div aria-hidden="true" className="hero-section-fade" />

      <div className="hero-content wrap">
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

        <HeroProductStack />

        {/* Interactive help-desk preview */}
        <div className="hero-demo-wrap hero-enter hero-enter-late">
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
