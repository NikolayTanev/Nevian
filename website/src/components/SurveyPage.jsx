import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  LoaderCircle,
  Lock,
  PenLine,
  RefreshCw,
  ShieldCheck,
  SquareTerminal,
  Ticket,
  User,
  Users,
  UsersRound,
} from 'lucide-react';
import ScratchNav from './ScratchNav.jsx';
import { submitSurvey } from '../lib/submitSurvey.js';

const STEPS = 3;

// Option codes must match PAINS / TEAM_SIZES in google/survey/Code.gs.
const PAIN_KEYS = ['repeat', 'patching', 'remote', 'compliance', 'other'];
const TEAM_KEYS = ['1', '2-3', '4-10', '10+'];

const painIcons = {
  repeat: Ticket,
  patching: RefreshCw,
  remote: SquareTerminal,
  compliance: ShieldCheck,
  other: PenLine,
};
const teamIcons = { '1': User, '2-3': Users, '4-10': UsersRound, '10+': Building2 };

const t = {
  title: 'Three quick questions for IT teams',
  q1: 'What takes up most of your time?',
  otherPlaceholder: 'What exactly?',
  q2: 'How big is your IT team?',
  q3: 'If you could get rid of one task forever, what would it be?',
  q3Hint: 'Optional',
  q3Placeholder: 'e.g. Fixing VPN issues',
  privacy: 'Anonymous. We only store your answers, no names or emails.',
  back: 'Back',
  next: 'Next',
  send: 'Send answers',
  sending: 'Sending',
  errSend: "That didn't go through. Please try again.",
  saved: 'Answers saved',
  resultLead: "Here's how Nevian helps:",
  // Q3 placeholder, tailored to the pick in Q1.
  examples: {
    repeat: 'e.g. Resetting passwords',
    patching: 'e.g. Updating third-party software by hand',
    remote: 'e.g. Fixing user issues over the phone',
    compliance: 'e.g. Filling in security questionnaires',
  },
  otherTitle: 'Thanks, we read every answer.',
  otherLead: 'Nevian might not solve this today, but your feedback helps shape what comes next.',
  cta: 'See how Nevian works',
  progress: (n) => `Question ${n} of ${STEPS}`,
  pains: {
    repeat: { title: 'The same simple tickets again and again', short: 'Repeat tickets', win: 'Nevian can help with repeat tickets', headline: 'AI chat support', answer: "Nevian's AI answers employees in a chat from your own knowledge base and knows when to hand over issues that need a human." },
    patching: { title: 'Keeping software patched', short: 'Patching', win: 'Nevian can help with patching', headline: 'Automated patching', answer: 'Nevian patches third-party software according to your defined policies, with approval workflows and scheduled updates.' },
    remote: { title: "Fixing users' machines remotely", short: 'Remote support', win: 'Nevian can help with remote support', headline: 'Remote terminal and scripts', answer: 'The Nevian agent gives you a remote terminal and approved scripts on every enrolled device.' },
    compliance: { title: 'Security and compliance paperwork', short: 'NIS2 / compliance', win: 'Nevian can help with security and compliance', headline: 'Vulnerabilities and audit log', answer: 'Nevian can easily match CVEs against your fleet and keeps a tamper-proof audit log. NIS2 reporting is also on the way.' },
    other: { title: 'Something else', short: 'Something else' },
  },
  teams: { '1': 'Just me', '2-3': '2–3', '4-10': '4–10', '10+': 'More than 10' },
};

export default function SurveyPage() {
  const [step, setStep] = useState(1); // 1..3 questions, 4 = result
  const [dir, setDir] = useState('next');
  const [pain, setPain] = useState('');
  const [otherText, setOtherText] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [wish, setWish] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const headingRef = useRef(null);
  const otherRef = useRef(null);
  const focusOther = useRef(false);
  const firstRender = useRef(true);
  const done = step > STEPS;

  // Clean "/survey" in the address bar.
  useEffect(() => {
    if (window.location.pathname.endsWith('.html')) {
      const path = window.location.pathname.replace(/\.html$/, '');
      window.history.replaceState(null, '', path + window.location.search + window.location.hash);
    }
  }, []);

  // Move focus to the new slide's heading so screen readers follow along.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  // Focus the "something else" box only at the moment that option is picked.
  useEffect(() => {
    if (focusOther.current) {
      focusOther.current = false;
      otherRef.current?.focus();
    }
  }, [pain]);

  const pickPain = (key) => {
    if (key === 'other' && pain !== 'other') focusOther.current = true;
    setPain(key);
  };

  const canAdvance = step === 1 ? Boolean(pain) : step === 2 ? Boolean(teamSize) : true;

  const go = (target) => {
    setError('');
    setDir(target > step ? 'next' : 'back');
    setStep(target);
  };

  const submit = async () => {
    setError('');
    setSending(true);
    try {
      await submitSurvey({
        pains: [pain],
        otherText: pain === 'other' ? otherText.trim() : '',
        teamSize,
        wish: wish.trim(),
        lang: 'en',
        website: honeypot,
      });
      go(STEPS + 1);
    } catch {
      setError(t.errSend);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canAdvance || sending) return;
    if (step < STEPS) go(step + 1);
    else submit();
  };

  const helped = pain && pain !== 'other' ? t.pains[pain] : null;
  const HelpedIcon = helped ? painIcons[pain] : null;

  return (
    <main className="scratch-page feature-page svy-page">
      <ScratchNav />

      <div className="svy-wrap">
        {!done && (
          <header className="svy-head">
            <h1>{t.title}</h1>
          </header>
        )}

        {done ? (
          <section className="svy-card svy-result" aria-labelledby="svy-result-title">
            <span className="svy-saved">
              <span className="svy-saved-dot" aria-hidden="true"><Check /></span>
              {t.saved}
            </span>
            <h1 id="svy-result-title" ref={headingRef} tabIndex={-1}>
              {helped ? helped.win : t.otherTitle}
            </h1>
            <p className="svy-result-lead">{helped ? t.resultLead : t.otherLead}</p>

            {helped && (
              <div className="svy-solution">
                <span className="svy-solution-icon" aria-hidden="true"><HelpedIcon /></span>
                <div className="svy-solution-body">
                  <div className="svy-solution-top">
                    <h2>{helped.headline}</h2>
                    <span className="svy-solution-pick">{helped.short}</span>
                  </div>
                  <p>{helped.answer}</p>
                </div>
              </div>
            )}

            <a className="scratch-primary svy-cta" href="/">
              {t.cta} <ArrowRight aria-hidden="true" />
            </a>
          </section>
        ) : (
          <form className="svy-card svy-form" onSubmit={handleSubmit} noValidate>
            <div
              className="svy-progress"
              role="progressbar"
              aria-label={t.progress(step)}
              aria-valuemin={1}
              aria-valuemax={STEPS}
              aria-valuenow={step}
            >
              {Array.from({ length: STEPS }, (_, i) => (
                <i key={i} className={i < step ? 'is-on' : ''} />
              ))}
            </div>

            <div className={`svy-slide is-${dir}`} key={step}>
              {step === 1 && (
                <div role="radiogroup" aria-labelledby="svy-q">
                  <h2 className="svy-q-title" id="svy-q" ref={headingRef} tabIndex={-1}>{t.q1}</h2>
                  <div className="svy-options">
                    {PAIN_KEYS.map((key) => {
                      const Icon = painIcons[key];
                      const checked = pain === key;
                      return (
                        <label key={key} className={`svy-option ${checked ? 'is-checked' : ''}`}>
                          <input
                            type="radio"
                            name="pain"
                            value={key}
                            checked={checked}
                            onChange={() => pickPain(key)}
                          />
                          <span className="svy-option-icon" aria-hidden="true"><Icon /></span>
                          <span className="svy-option-text">{t.pains[key].title}</span>
                          <span className="svy-option-mark" aria-hidden="true"><Check /></span>
                        </label>
                      );
                    })}
                  </div>
                  {pain === 'other' && (
                    <input
                      ref={otherRef}
                      className="svy-input svy-other-input"
                      type="text"
                      maxLength={200}
                      aria-label={`${t.pains.other.title}: ${t.otherPlaceholder}`}
                      placeholder={t.otherPlaceholder}
                      value={otherText}
                      onChange={(event) => setOtherText(event.target.value)}
                    />
                  )}
                </div>
              )}

              {step === 2 && (
                <div role="radiogroup" aria-labelledby="svy-q">
                  <h2 className="svy-q-title" id="svy-q" ref={headingRef} tabIndex={-1}>{t.q2}</h2>
                  <div className="svy-teams">
                    {TEAM_KEYS.map((key) => {
                      const Icon = teamIcons[key];
                      const checked = teamSize === key;
                      return (
                        <label key={key} className={`svy-team ${checked ? 'is-checked' : ''}`}>
                          <input
                            type="radio"
                            name="teamSize"
                            value={key}
                            checked={checked}
                            onChange={() => setTeamSize(key)}
                          />
                          <Icon aria-hidden="true" />
                          <span>{t.teams[key]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="svy-q-title" ref={headingRef} tabIndex={-1}>
                    <label htmlFor="svy-wish">{t.q3}</label>
                  </h2>
                  <p className="svy-hint">{t.q3Hint}</p>
                  <textarea
                    id="svy-wish"
                    className="svy-input svy-wish"
                    rows="4"
                    maxLength={1000}
                    placeholder={t.examples[pain] || t.q3Placeholder}
                    value={wish}
                    onChange={(event) => setWish(event.target.value)}
                  />
                </div>
              )}
            </div>

            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
              <label>
                Leave empty
                <input name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
              </label>
            </div>

            <div className="svy-nav">
              {step > 1 ? (
                <button type="button" className="svy-icon-btn svy-back" aria-label={t.back} title={t.back} onClick={() => go(step - 1)}>
                  <ArrowLeft aria-hidden="true" />
                </button>
              ) : <span />}
              <button
                type="submit"
                className="svy-icon-btn svy-next"
                aria-label={sending ? t.sending : step === STEPS ? t.send : t.next}
                title={step === STEPS ? t.send : t.next}
                disabled={!canAdvance || sending}
              >
                {sending
                  ? <LoaderCircle className="svy-spin" aria-hidden="true" />
                  : step === STEPS ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              </button>
            </div>
            <p className="svy-error" role="alert">{error}</p>
          </form>
        )}

        {!done && (
          <p className="svy-privacy"><Lock aria-hidden="true" />{t.privacy}</p>
        )}
      </div>

      <footer className="svy-foot">
        <span>© {new Date().getFullYear()} Nevian</span>
        <a href="/">nevian.info</a>
      </footer>
    </main>
  );
}
