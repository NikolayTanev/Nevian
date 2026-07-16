import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconArrow, IconCheck } from './Icons.jsx';

const phaseDurations = [1400, 2600, 2850, 1200, 2500, 1200, 2150, 2400, 1200, 2750, 1200, 1750, 2700, 2200, 2400, 1200, 2800];
const demoUser = {
  name: 'Linda Mogridge',
  email: 'linda.mogridge@contoso.com',
  avatar: '/assets/linda-mogridge.png',
};

function UserAvatar({ phone = false }) {
  return (
    <i className={`password-user-avatar${phone ? ' is-phone' : ''}`} aria-hidden="true">
      <img src={demoUser.avatar} alt="" />
    </i>
  );
}

function MicrosoftMark() {
  return (
    <span className="password-ms-brand">
      <i className="is-red" /><i className="is-green" /><i className="is-blue" /><i className="is-yellow" />
      <strong>Microsoft</strong>
    </span>
  );
}

function MiniIcon({ type }) {
  const paths = {
    shield: 'M12 3 5 6v5c0 4.4 2.8 7.6 7 9 4.2-1.4 7-4.6 7-9V6l-7-3Zm-2 9 1.4 1.5L15 9.8',
    code: 'M4 6h16v12H4zM8 10h2m-2 4h4',
    chat: 'M4 5h16v11H8l-4 3V5Z',
    phone: 'M7 3h3l1.3 4-2 1.7a16 16 0 0 0 6 6l1.7-2 4 1.3v3c0 2-1.6 3.4-3.5 3C10.3 19 5 13.7 4 6.5 3.7 4.6 5 3 7 3Z',
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[type]} /></svg>;
}

function PersistentCursor({ frameRef, phase }) {
  const cursorRef = useRef(null);
  const clicking = [3, 5, 6, 8, 10, 15].includes(phase);
  const clickDelay = phase === 6 ? 1.62 : .68;

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const cursor = cursorRef.current;
    if (!frame || !cursor) return undefined;

    let animationFrame = 0;
    let followUntil = performance.now() + 1450;

    const updatePosition = () => {
      const target = frame.querySelector('[data-password-cursor-target="true"]');
      if (target) {
        const frameRect = frame.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const x = targetRect.left - frameRect.left + targetRect.width / 2 - 3;
        const y = targetRect.top - frameRect.top + targetRect.height / 2 - 2;
        cursor.style.setProperty('--password-cursor-x', `${x}px`);
        cursor.style.setProperty('--password-cursor-y', `${y}px`);
        cursor.classList.add('is-ready');
      }

      if (performance.now() < followUntil) {
        animationFrame = window.requestAnimationFrame(updatePosition);
      }
    };

    const followTarget = () => {
      window.cancelAnimationFrame(animationFrame);
      followUntil = performance.now() + 900;
      animationFrame = window.requestAnimationFrame(updatePosition);
    };

    const mutationObserver = new MutationObserver(followTarget);
    mutationObserver.observe(frame, { childList: true, subtree: true });
    window.addEventListener('resize', followTarget);
    animationFrame = window.requestAnimationFrame(updatePosition);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      mutationObserver.disconnect();
      window.removeEventListener('resize', followTarget);
    };
  }, [frameRef, phase]);

  return (
    <span ref={cursorRef} className="password-persistent-cursor" style={{ '--cursor-delay': `${clickDelay}s` }} aria-hidden="true">
      <svg key={`pointer-${phase}`} className={clicking ? 'is-clicking' : ''} viewBox="0 0 28 36"><path d="M3 2v27l7-7 5 11 5-2-5-11h10L3 2Z" /></svg>
      {clicking && <i key={`click-${phase}`} />}
    </span>
  );
}

function TypedValue({ value, delay = 280, duration = 1450 }) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(0);
    let interval = 0;
    const start = window.setTimeout(() => {
      const step = Math.max(38, duration / value.length);
      interval = window.setInterval(() => {
        setLength((current) => {
          if (current >= value.length) {
            window.clearInterval(interval);
            return current;
          }
          return current + 1;
        });
      }, step);
    }, delay);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [delay, duration, value]);

  return (
    <span className="password-ms-live-value">
      {value.slice(0, length)}<i aria-hidden="true" />
    </span>
  );
}

function EmailPane({ password = false, phase }) {
  const clicking = (phase === 5 && !password) || (phase === 6 && password);

  return (
    <div className="password-ms-signin">
      <div className="password-ms-card">
        <MicrosoftMark />
        <h3>{password ? 'Enter password' : 'Sign in'}</h3>
        {password && <div className="password-ms-account">{demoUser.email}</div>}
        <div className={`password-ms-field ${password ? 'is-password' : ''}`}>
          <TypedValue value={password ? '••••••••••••' : demoUser.email} duration={password ? 1200 : 1550} />
        </div>
        {!password && <p>No account? <b>Create one!</b></p>}
        <a>{password ? 'Forgot my password' : "Can't access your account?"}</a>
        <div className="password-ms-actions">
          <button type="button" className="is-back">Back</button>
          <button type="button" className={`is-next${clicking ? ` is-clicking${password ? ' is-late-click' : ''}` : ''}`} data-password-cursor-target="true">
            {password ? 'Sign in' : 'Next'}
          </button>
        </div>
      </div>
      {!password && (
        <div className="password-ms-options"><MiniIcon type="phone" /> Sign-in options</div>
      )}
    </div>
  );
}

function IdentityPane({ phase }) {
  const methods = [
    ['shield', 'Approve a request on my Microsoft Authenticator app'],
    ['code', 'Use a verification code from my mobile app'],
    ['chat', 'Text +X XXX-XXXX-40'],
    ['phone', 'Call +X XXX-XXXX-40'],
  ];

  return (
    <div className="password-ms-identity-frame">
      <div className="password-ms-identity">
        <MicrosoftMark />
        <div className="password-ms-account">{demoUser.email}</div>
        <h3>Verify your identity</h3>
        <div className="password-ms-methods">
          {methods.map(([icon, label], index) => (
            <button key={label} type="button" className={`${index === 0 ? 'is-target' : ''}${index === 0 && phase === 8 ? ' is-clicking' : ''}`} data-password-cursor-target={index === 0 ? 'true' : undefined}>
              <MiniIcon type={icon} />
              <span>{label}</span>
              <IconArrow />
            </button>
          ))}
        </div>
        <a>More information</a>
        <button type="button" className="password-ms-cancel">Cancel</button>
      </div>
    </div>
  );
}

function AuthenticatorPane({ selected, phase }) {
  return (
    <div className="password-mfa-pair">
      <div className="password-mfa-request">
        <MicrosoftMark />
        <span>← {demoUser.email}</span>
        <h3>Approve sign in</h3>
        <p>Tap the number you see below in your Microsoft Authenticator app to sign in.</p>
        <strong>28</strong>
        <small>No numbers in the app? Make sure you&apos;re using the latest version.</small>
        <a>Or, sign in another way.</a>
      </div>

      <div className="password-phone">
        <div className="password-phone-status">
          <strong>9:41</strong>
          <span aria-hidden="true"><i className="is-signal" /><i className="is-wifi" /><i className="is-battery" /></span>
        </div>
        <div className="password-phone-speaker" />
        <div className="password-phone-header"><span>☰</span> Authenticator <b>＋</b></div>
        <div className="password-phone-accounts">
          <div><UserAvatar phone /><span>{demoUser.name}<small>Contoso Corporation</small></span><b>›</b></div>
          <div><i>IT</i><span>IT Operations<small>Microsoft Entra ID</small></span><b>›</b></div>
          <div><i>NV</i><span>Nevian Demo<small>Passwordless</small></span><b>›</b></div>
        </div>
        <div className="password-phone-approval">
          <strong>Approve sign in?</strong>
          <span>Contoso Corporation</span>
          <small>{demoUser.email}</small>
          <button type="button" className={selected ? 'is-selected' : ''} data-password-cursor-target="true">
            28
          </button>
          <button type="button">54</button>
          <button type="button">90</button>
          <button type="button" className="is-deny">Deny</button>
        </div>
        <div className="password-phone-home" aria-hidden="true" />
      </div>
    </div>
  );
}

function SigningPane() {
  return (
    <div className="password-ms-signing" data-password-cursor-target="true">
      <MicrosoftMark />
      <div className="password-ms-spinner"><i /><i /></div>
      <h3>Completing verification</h3>
      <p>Securely returning to Nevian…</p>
    </div>
  );
}

export default function PasswordResetDemo() {
  const sectionRef = useRef(null);
  const demoFrameRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const [inView, setInView] = useState(false);
  const [run, setRun] = useState(0);
  const [showAgentReply, setShowAgentReply] = useState(false);

  useEffect(() => {
    let wasActive = false;
    const observer = new IntersectionObserver(([entry]) => {
      const isActive = entry.isIntersecting && entry.intersectionRatio >= .22;

      if (isActive !== wasActive) {
        wasActive = isActive;
        setInView(isActive);
        setPhase(0);
        setShowAgentReply(false);
        setRun((value) => value + 1);
      }
    }, { threshold: [0, .22, .5] });

    if (demoFrameRef.current) observer.observe(demoFrameRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPhase(13);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setPhase((current) => (current >= phaseDurations.length - 1 ? 0 : current + 1));
    }, phaseDurations[phase]);
    return () => window.clearTimeout(timer);
  }, [phase, inView, run]);

  useEffect(() => {
    if (phase < 2) {
      setShowAgentReply(false);
      return undefined;
    }

    if (phase > 2) {
      setShowAgentReply(true);
      return undefined;
    }

    setShowAgentReply(false);
    const settle = window.setTimeout(() => setShowAgentReply(true), 1250);
    return () => window.clearTimeout(settle);
  }, [phase, run]);

  const replay = () => {
    setPhase(0);
    setRun((value) => value + 1);
  };

  const microsoftMode = phase < 4 || phase > 11
    ? 'hidden'
    : phase <= 5
      ? 'email'
      : phase === 6
        ? 'password'
        : phase <= 8
          ? 'identity'
          : phase <= 10
            ? 'authenticator'
            : 'signing';
  const messageCloseup = phase === 1;
  const conversationFocused = phase >= 2;
  const progress = phase < 4 ? 0 : phase < 7 ? 1 : phase < 11 ? 2 : 3;

  return (
    <section ref={sectionRef} id="password-reset" className="password-demo-section">
      <div className="password-demo-shell">
        <header className="password-demo-heading">
          <div>
            <span><i /> Automated password recovery</span>
            <h2>From locked out to back in—without an IT ticket.</h2>
          </div>
          <div className="password-demo-heading-copy">
            <p>Nevian verifies identity through Microsoft, keeps every step visible, and returns the user to work in minutes.</p>
            <button type="button" onClick={replay}>Replay demo <IconArrow /></button>
          </div>
        </header>

        <div ref={demoFrameRef} className="password-demo-frame" data-phase={phase}>
          <div className={`password-demo-camera ${messageCloseup ? 'is-message-closeup' : ''} ${microsoftMode !== 'hidden' ? 'is-auth-open' : ''}`}>
            <div className={`password-demo-workspace ${conversationFocused ? 'is-conversation-focused' : ''}`}>
              <main className="password-demo-chat">
                <header>
                  <div><span className="password-demo-agent-mark"><img src="/assets/logo.png" alt="" /></span><b>Nevian AI</b><small><i /> Online · Identity recovery</small></div>
                  <button type="button">•••</button>
                </header>
                <div className="password-demo-messages">
                  <div className="password-demo-date">Today · Secure conversation</div>

                  {phase >= 1 && (
                    <div className="password-chat-row is-user">
                      <div className="password-chat-bubble is-user" data-password-cursor-target={phase <= 2 ? 'true' : undefined}><span className={phase === 1 ? 'password-type-user' : ''}>I forgot my password.</span></div>
                      <UserAvatar />
                    </div>
                  )}

                  {showAgentReply && phase < 12 && (
                    <div className="password-chat-row is-agent">
                      <span className="password-demo-agent-mark"><img src="/assets/logo.png" alt="" /></span>
                      <div className="password-chat-bubble is-agent">
                        <b>I can help with that.</b>
                        <p>Before resetting your password, I need to verify your identity securely with Microsoft.</p>
                        {phase <= 3 && (
                          <button type="button" className={`password-verify-button${phase === 3 ? ' is-clicking' : ''}`} data-password-cursor-target={phase === 3 ? 'true' : undefined}>
                            <MiniIcon type="shield" /> Verify with Microsoft <IconArrow />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {phase >= 12 && (
                    <div className="password-chat-row is-agent password-chat-success">
                      <span className="password-demo-agent-mark"><img src="/assets/logo.png" alt="" /></span>
                      <div className="password-chat-bubble is-agent" data-password-cursor-target={phase === 12 ? 'true' : undefined}>
                        <span className="password-success-label"><IconCheck /> Identity verified</span>
                        <b>You&apos;re all set.</b>
                        <p>At your next sign-in, Microsoft will ask you to create a new password. No technician needed.</p>
                      </div>
                    </div>
                  )}

                  {phase >= 13 && (
                    <div className="password-chat-row is-user password-chat-thanks">
                      <div className="password-chat-bubble is-user" data-password-cursor-target={phase === 13 ? 'true' : undefined}>Perfect, thank you!</div><UserAvatar />
                    </div>
                  )}

                  {phase >= 14 && (
                    <div className="password-chat-row is-agent password-chat-close">
                      <span className="password-demo-agent-mark"><img src="/assets/logo.png" alt="" /></span>
                      <div key={phase >= 16 ? 'closed' : 'choice'} className="password-chat-bubble is-agent password-close-state" data-password-cursor-target={phase >= 16 ? 'true' : undefined}>
                        {phase < 16 ? (
                          <>
                            <b>Happy to help.</b>
                            <p>Would you like me to close this ticket?</p>
                            <div className="password-close-actions">
                              <button type="button" className={`is-close${phase === 15 ? ' is-clicking' : ''}`} data-password-cursor-target="true">
                                <IconCheck /> Close ticket
                              </button>
                              <button type="button" className="is-more">I need more help</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="password-success-label"><IconCheck /> Ticket closed</span>
                            <b>Conversation complete.</b>
                            <p>The resolution has been saved to the audit trail.</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="password-demo-composer" data-password-cursor-target={phase === 0 ? 'true' : undefined}><span>Message Nevian AI…</span><button type="button">↑</button></div>
              </main>

              <aside className="password-demo-context">
                <span>Recovery context</span>
                <div className="password-context-user"><UserAvatar /><b>{demoUser.name}</b><small>Finance · Berlin</small></div>
                <dl><div><dt>Account</dt><dd>Microsoft 365</dd></div><div><dt>Device</dt><dd>NEV-LT-042</dd></div><div><dt>Risk</dt><dd className="is-low">Low</dd></div></dl>
                <div className="password-context-policy"><MiniIcon type="shield" /><span><b>Reset policy</b><small>MFA required · Fully audited</small></span></div>
              </aside>
            </div>
          </div>

          <div className={`password-microsoft-layer ${microsoftMode !== 'hidden' ? 'is-visible' : ''}`}>
            {microsoftMode !== 'hidden' && (
              <div key={microsoftMode} className={`password-microsoft-scene is-${microsoftMode}`}>
                {microsoftMode === 'email' && <EmailPane phase={phase} />}
                {microsoftMode === 'password' && <EmailPane password phase={phase} />}
                {microsoftMode === 'identity' && <IdentityPane phase={phase} />}
                {microsoftMode === 'authenticator' && <AuthenticatorPane selected={phase === 10} phase={phase} />}
                {microsoftMode === 'signing' && <SigningPane />}
              </div>
            )}
          </div>

          <PersistentCursor frameRef={demoFrameRef} phase={phase} />

          <div className="password-demo-progress">
            {['Request', 'Sign in', 'Verify', phase >= 16 ? 'Closed' : 'Reset ready'].map((label, index) => (
              <div key={label} className={`${progress === index ? 'is-active' : ''} ${progress > index ? 'is-done' : ''}`}>
                <i>{progress > index ? <IconCheck /> : index + 1}</i><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
