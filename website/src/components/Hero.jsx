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
      { role: 'ai', text: "Verified. Here's a temporary password: ", code: 'Tq7$kR2wze', tail: ". You'll set a new one at next sign-in." },
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
    sys: { kind: 'green', text: 'Resolved automatically · no waiting' },
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
      { role: 'ai', text: "This one needs hands-on repair, so I've escalated it with your logs and full device context attached." },
    ],
    sys: { kind: 'amber', text: 'Escalated to 2nd-level · assigned to Alex R.' },
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
    sys: { kind: 'green', text: 'Resolved automatically · no waiting' },
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

export default function Hero() {
  const [active, setActive] = useState('t1');
  const current = tickets.find((t) => t.id === active);

  return (
    <section id="top" className="hero-section">
      {/* Full-bleed artwork across the complete hero. */}
      <div aria-hidden="true" className="hero-background" />
      {/* The artwork dissolves directly into the following dark section. */}
      <div aria-hidden="true" className="hero-section-fade" />

      <div className="hero-content wrap">
        {/* Headline + CTAs, centered */}
        <div className="hero-copy hero-enter">
          <div className="hero-eyebrow"><i /> AI-powered service desk</div>
          <h1>
            Resolve tickets faster with <span className="text-accent">AI</span> and full endpoint context.
          </h1>
          <p>Resolve routine work instantly while your team keeps full visibility and control.</p>
          <div className="hero-actions">
            <a href="#contact" className="hero-button hero-button-primary">Book a demo</a>
            <a href="#how" className="hero-button hero-button-secondary">
              See How It Works <IconArrow className="h-4 w-4" />
            </a>
          </div>
        </div>

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
              <a href="#contact" className="hero-demo-link">Open workspace <IconArrow className="h-3.5 w-3.5" /></a>
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
