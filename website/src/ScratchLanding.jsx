import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import PasswordResetDemo from './components/PasswordResetDemo.jsx';
import Integrations from './components/Integrations.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import PlatformMenu from './components/PlatformMenu.jsx';

gsap.registerPlugin(ScrollToPlugin);

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

// "Cut routine workload" card: a Core-Web-Vitals-style panel, but the metrics
// describe how much manual IT work Nevian removes from the queue.
function WorkloadVitals() {
  const metrics = [
    { label: 'Routine tickets automated', value: '60%', fill: 60 },
    { label: 'Time to first action', value: '1.2s', fill: 22 },
    { label: 'Actions recorded', value: '100%', fill: 100 },
  ];

  return (
    <div className="bento-vitals" aria-hidden="true">
      <div className="bento-vitals-head">
        <span>Queue health</span>
        <em className="bento-vitals-badge">GOOD</em>
      </div>
      <ul>
        {metrics.map((metric) => (
          <li key={metric.label}>
            <div className="bento-vitals-row">
              <span>{metric.label} <i>i</i></span>
              <strong>{metric.value}</strong>
            </div>
            <div className="bento-vitals-bar" style={{ '--fill': `${metric.fill}%` }}><b /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// "Device context" card: a CMS-style table showing the device details that
// arrive attached to every request, so nobody has to ask for them later.
function DeviceContextTable() {
  const rows = [
    { device: 'NEV-LT-042', meta: 'Windows 11 · Finance', health: 'Healthy', risk: 'Low', seen: '2m ago' },
    { device: 'NEV-LT-118', meta: 'Windows 11 · Sales', health: 'Patch pending', risk: 'Low', seen: '5m ago' },
    { device: 'NEV-MB-207', meta: 'macOS 14 · Design', health: 'Healthy', risk: 'Low', seen: '11m ago' },
    { device: 'NEV-SRV-03', meta: 'Windows Server · DC', health: 'Healthy', risk: 'Medium', seen: '1m ago' },
    { device: 'NEV-LT-311', meta: 'Windows 11 · Support', health: 'Reboot due', risk: 'Low', seen: '18m ago' },
    { device: 'NEV-LT-204', meta: 'Windows 11 · Ops', health: 'Healthy', risk: 'Low', seen: '3m ago' },
    { device: 'NEV-MB-090', meta: 'iOS 17 · Field', health: 'Healthy', risk: 'Low', seen: '9m ago' },
  ];

  return (
    <div className="bento-cms" aria-hidden="true">
      <div className="bento-cms-toolbar">
        <div className="bento-cms-tabs"><span className="is-active">Devices</span><span>Signals</span></div>
        <div className="bento-cms-tools"><i>+</i><i>⇅</i><i>≣</i><i>⌕</i></div>
      </div>
      <div className="bento-cms-body">
        <aside className="bento-cms-tree">
          <div className="bento-cms-tree-group is-open"><span>▾ Endpoints</span></div>
          <div className="bento-cms-tree-item">Laptops <em>128</em></div>
          <div className="bento-cms-tree-item is-active">Desktops <em>64</em></div>
          <div className="bento-cms-tree-item">Mobile <em>212</em></div>
          <div className="bento-cms-tree-group"><span>▸ Servers</span></div>
          <div className="bento-cms-tree-group"><span>▸ Identity</span></div>
          <div className="bento-cms-tree-group"><span>▸ Cloud</span></div>
          <div className="bento-cms-tree-add">+ Add source</div>
        </aside>
        <div className="bento-cms-table">
          <div className="bento-cms-thead"><span>Device</span><span>Health</span><span>Risk</span><span>Last seen</span></div>
          {rows.map((row) => (
            <div className="bento-cms-row" key={row.device}>
              <span className="bento-cms-cell-device"><i /><b>{row.device}</b><small>{row.meta}</small></span>
              <span className="bento-cms-cell-health"><i /> {row.health}</span>
              <span className={`bento-cms-cell-risk is-${row.risk.toLowerCase()}`}>{row.risk}</span>
              <span className="bento-cms-cell-seen">{row.seen}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Fingerprint outline paths (shared by the faint base layer and the green
// "scanning" layer). Adapted from the inspiration animation.
const fingerprintPaths = [
  ['odd', 'm 25.117139,57.142857 c 0,0 -1.968558,-7.660465 -0.643619,-13.149003 1.324939,-5.488538 4.659682,-8.994751 4.659682,-8.994751'],
  ['odd', 'm 31.925369,31.477584 c 0,0 2.153609,-2.934998 9.074971,-5.105078 6.921362,-2.17008 11.799844,-0.618718 11.799844,-0.618718'],
  ['odd', 'm 57.131213,26.814448 c 0,0 5.127709,1.731228 9.899495,7.513009 4.771786,5.781781 4.772971,12.109204 4.772971,12.109204'],
  ['odd', 'm 72.334009,50.76769 0.09597,2.298098 -0.09597,2.386485'],
  ['even', 'm 27.849282,62.75 c 0,0 1.286086,-1.279223 1.25,-4.25 -0.03609,-2.970777 -1.606117,-7.675266 -0.625,-12.75 0.981117,-5.074734 4.5,-9.5 4.5,-9.5'],
  ['even', 'm 36.224282,33.625 c 0,0 8.821171,-7.174484 19.3125,-2.8125 10.491329,4.361984 11.870558,14.952665 11.870558,14.952665'],
  ['even', 'm 68.349282,49.75 c 0,0 0.500124,3.82939 0.5625,5.8125 0.06238,1.98311 -0.1875,5.9375 -0.1875,5.9375'],
  ['odd', 'm 31.099282,65.625 c 0,0 1.764703,-4.224042 2,-7.375 0.235297,-3.150958 -1.943873,-9.276886 0.426777,-15.441942 2.370649,-6.165056 8.073223,-7.933058 8.073223,-7.933058'],
  ['odd', 'm 45.849282,33.625 c 0,0 12.805566,-1.968622 17,9.9375 4.194434,11.906122 1.125,24.0625 1.125,24.0625'],
  ['even', 'm 59.099282,70.25 c 0,0 0.870577,-2.956221 1.1875,-4.5625 0.316923,-1.606279 0.5625,-5.0625 0.5625,-5.0625'],
  ['even', 'm 60.901059,56.286612 c 0,0 0.903689,-9.415996 -3.801777,-14.849112 -3.03125,-3.5 -7.329245,-4.723939 -11.867187,-3.8125 -5.523438,1.109375 -7.570313,5.75 -7.570313,5.75'],
  ['even', 'm 34.072577,68.846248 c 0,0 2.274231,-4.165782 2.839205,-9.033748 0.443558,-3.821814 -0.49394,-5.649939 -0.714206,-8.05386 -0.220265,-2.403922 0.21421,-4.63364 0.21421,-4.63364'],
  ['odd', 'm 37.774165,70.831845 c 0,0 2.692139,-6.147592 3.223034,-11.251208 0.530895,-5.103616 -2.18372,-7.95562 -0.153491,-13.647655 2.030229,-5.692035 8.108442,-4.538898 8.108442,-4.538898'],
  ['odd', 'm 54.391174,71.715729 c 0,0 2.359472,-5.427681 2.519068,-16.175068 0.159595,-10.747388 -4.375223,-12.993087 -4.375223,-12.993087'],
  ['even', 'm 49.474282,73.625 c 0,0 3.730297,-8.451831 3.577665,-16.493718 -0.152632,-8.041887 -0.364805,-11.869326 -4.765165,-11.756282 -4.400364,0.113044 -3.875,4.875 -3.875,4.875'],
  ['even', 'm 41.132922,72.334447 c 0,0 2.49775,-5.267079 3.181981,-8.883029 0.68423,-3.61595 0.353553,-9.413359 0.353553,-9.413359'],
  ['odd', 'm 45.161782,73.75 c 0,0 1.534894,-3.679847 2.40625,-6.53125 0.871356,-2.851403 1.28125,-7.15625 1.28125,-7.15625'],
  ['odd', 'm 48.801947,56.125 c 0,0 0.234502,-1.809418 0.109835,-3.375 -0.124667,-1.565582 -0.5625,-3.1875 -0.5625,-3.1875'],
];

function FingerprintLayer({ variant }) {
  return (
    <svg className={`bento-auth-print bento-auth-print-${variant}`} viewBox="0 0 100 100" width="100" height="100">
      <g className="bento-auth-print-out" fill="none" strokeWidth="2" strokeLinecap="round">
        {fingerprintPaths.map(([cls, d], index) => <path key={index} className={cls} d={d} />)}
      </g>
    </svg>
  );
}

// "Identity verification" card: a looping fingerprint scan that resolves into a
// green checkmark. Recoded from the inspiration to run on view, not on click.
function IdentityVerify() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(true);
      return undefined;
    }

    let offTimer = 0;
    let onTimer = 0;
    let cancelled = false;

    const cycle = () => {
      setActive(true);
      offTimer = window.setTimeout(() => {
        setActive(false);
        // Rest on the "Verify identity" pill roughly twice as long before scanning again.
        onTimer = window.setTimeout(() => { if (!cancelled) cycle(); }, 1600);
      }, 6000);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !offTimer && !onTimer) {
        cycle();
      } else if (!entry.isIntersecting) {
        cancelled = true;
        window.clearTimeout(offTimer);
        window.clearTimeout(onTimer);
        offTimer = 0;
        onTimer = 0;
        cancelled = false;
        setActive(false);
      }
    }, { threshold: 0.3 });

    observer.observe(el);
    return () => {
      cancelled = true;
      window.clearTimeout(offTimer);
      window.clearTimeout(onTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bento-auth" aria-hidden="true">
      <div ref={ref} className={`bento-auth-pill ${active ? 'is-active' : ''}`}>
        <span className="bento-auth-text">Verify identity</span>
        <FingerprintLayer variant="base" />
        <FingerprintLayer variant="active" />
        <svg className="bento-auth-ok" viewBox="0 0 100 100" width="100" height="100">
          <path d="M34.912 50.75l10.89 10.125L67 36.75" fill="none" stroke="#57e39b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

// Same set of integrations shown in the platform dropdown preview.
const integrationPreviewIcons = ['jira', 'servicenow', 'microsoft-6', 'azure-2'];

function IntegrationsPreview() {
  return (
    <div className="bento-integrations" aria-hidden="true">
      {integrationPreviewIcons.map((id) => (
        <span key={id}><img src={`/assets/integrations/${id}.svg`} alt="" /></span>
      ))}
    </div>
  );
}

// "Insights" card: a Framer-style analytics panel — stat row + a two-series
// area chart with a floating tooltip, in our support-metrics context.
function InsightsAnalytics() {
  const stats = [
    { label: 'Active tickets', value: '11', live: true },
    { label: 'Resolved · 30d', value: '842' },
    { label: 'Auto-resolved', value: '60%' },
    { label: 'Avg. first response', value: '1.2s', muted: true },
  ];

  const line1 = 'M0 150 L50 120 L100 138 L150 100 L200 118 L250 86 L300 104 L350 80 L400 96 L450 70 L500 88 L550 64 L600 82';
  const line2 = 'M0 170 L50 150 L100 160 L150 140 L200 152 L250 132 L300 146 L350 150 L400 138 L450 120 L500 132 L550 116 L600 128';
  // Always the current date, formatted on the client at render time.
  const todayLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bento-insights" aria-hidden="true">
      <div className="bento-insights-head">
        <h4>Support analytics</h4>
        <span>{todayLabel}</span>
      </div>
      <div className="bento-insights-stats">
        {stats.map((stat) => (
          <div key={stat.label} className={stat.muted ? 'is-muted' : ''}>
            <span>{stat.label}{stat.live && <i className="bento-insights-live" />}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
      <div className="bento-insights-chart">
        <span className="bento-insights-axis">330k</span>
        <svg viewBox="0 0 600 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bentoArea1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#57e39b" stopOpacity=".5" />
              <stop offset="1" stopColor="#57e39b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="bentoArea2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#3fd0d8" stopOpacity=".34" />
              <stop offset="1" stopColor="#3fd0d8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line1} L600 200 L0 200 Z`} fill="url(#bentoArea1)" />
          <path d={`${line2} L600 200 L0 200 Z`} fill="url(#bentoArea2)" />
          <path className="bento-insights-line2" d={line2} />
          <path className="bento-insights-line1" d={line1} />
        </svg>
        <div className="bento-insights-tooltip">
          <span>{todayLabel}</span>
          <div><i className="bento-dot1" /> Automated <b>548</b></div>
          <div><i className="bento-dot2" /> Resolved <b>135</b></div>
        </div>
      </div>
    </div>
  );
}

// "Security" card: a browser address bar with a highlighted lock, copied from
// the Framer card but in our green accent and domain.
function SecurityBar() {
  return (
    <div className="bento-security" aria-hidden="true">
      <div className="bento-security-bar">
        <div className="bento-security-nav">
          <svg viewBox="0 0 20 20"><path d="M12 5l-5 5 5 5" /></svg>
          <svg viewBox="0 0 20 20"><path d="M8 5l5 5-5 5" /></svg>
          <svg viewBox="0 0 20 20"><path d="M15.5 6.5A6 6 0 1 0 16 12M15.5 3v3.5H12" /></svg>
        </div>
        <div className="bento-security-url">
          <span className="bento-security-lock">
            <svg viewBox="0 0 20 20"><rect x="4.5" y="9" width="11" height="7.5" rx="2" /><path d="M7 9V6.4a3 3 0 0 1 6 0V9" /></svg>
          </span>
          <span className="bento-security-addr"><i>https://</i>your-company.nevian.com<i>/support</i></span>
        </div>
      </div>
    </div>
  );
}

// "Smart routing" card: a compressed, cropped fragment of the architecture
// flow — node chips around the Nevian core, wired with connectors + flow dots.
function RoutingIcon({ type }) {
  const paths = {
    desk: <><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M9 20h6m-3-3.5V20" /></>,
    server: <><rect x="4" y="4" width="16" height="7" rx="1.6" /><rect x="4" y="13" width="16" height="7" rx="1.6" /><path d="M7.5 7.5h.01M7.5 16.5h.01" /></>,
    auto: <path d="M4 12l5 5L20 6" />,
    infra: <><path d="M12 3 4 7l8 4 8-4-8-4Z" /><path d="M4 12l8 4 8-4M4 17l8 4 8-4" /></>,
    kb: <><path d="M6 4h9a1 1 0 0 1 1 1v15H8a2 2 0 0 0-2 2V4Z" /><path d="M16 5h2a1 1 0 0 1 1 1v14" /></>,
  };
  return <svg viewBox="0 0 24 24">{paths[type]}</svg>;
}

const routingSources = [
  { key: 'infra', label: 'Infrastructure', icon: 'infra', x: 23, y: 24 },
  { key: 'kb', label: 'Knowledge base', icon: 'kb', x: 23, y: 50 },
];
const routingNodes = [
  { key: 'desk', label: 'Desk Agent', icon: 'desk', x: 77, y: 24 },
  { key: 'server', label: 'Server Agent', icon: 'server', x: 77, y: 50 },
  { key: 'auto', label: 'Auto-resolve', icon: 'auto', x: 77, y: 76 },
];

function SmartRoutingGraph() {
  const core = { x: 50, y: 50 };
  return (
    <div className="bento-routing" aria-hidden="true">
      <svg className="bento-routing-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g className="bento-routing-paths">
          {/* sources -> core (mirror of the destination connectors) */}
          <path d="M40 24 Q42 24 42 28 V40 Q42 44 44 44 H47" />
          <path d="M40 50 H47" />
          {/* core -> destinations */}
          <path d="M53 44 H56 Q58 44 58 40 V28 Q58 24 60 24" />
          <path d="M53 50 H60" />
          <path d="M53 56 H56 Q58 56 58 60 V72 Q58 76 60 76" />
        </g>
      </svg>
      {routingSources.map((node) => (
        <span key={node.key} className="bento-routing-node bento-routing-src" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
          <RoutingIcon type={node.icon} /><span className="bento-routing-label">{node.label}</span>
        </span>
      ))}
      <span className="bento-routing-core" style={{ left: `${core.x}%`, top: `${core.y}%` }}>
        <img src="/assets/logo.png" alt="" />
      </span>
      {routingNodes.map((node) => (
        <span key={node.key} className="bento-routing-node" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
          <RoutingIcon type={node.icon} /><span className="bento-routing-label">{node.label}</span>
        </span>
      ))}
    </div>
  );
}

// "Audit trail" card: a compact timeline of recorded actions with timestamps.
function AuditTrail() {
  const entries = [
    { label: 'Identity verified', time: 'now' },
    { label: 'Ticket #4821 closed', time: '14s' },
    { label: 'Written to audit log', time: '1s' },
  ];
  return (
    <div className="bento-audit" aria-hidden="true">
      {entries.map((entry, index) => (
        <div className="bento-audit-row" key={index}>
          <span className="bento-audit-check"><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg></span>
          <span className="bento-audit-label">{entry.label}</span>
          <span className="bento-audit-time">{entry.time}</span>
        </div>
      ))}
    </div>
  );
}

// "Human handoff" card: Nevian escalates to a human agent with full context.
function HumanHandoff() {
  const shared = ['Identity & device context', 'Full conversation history', 'Actions already attempted'];
  return (
    <div className="bento-handoff" aria-hidden="true">
      <div className="bento-handoff-note">
        <span className="bento-handoff-mark"><img src="/assets/logo.png" alt="" /></span>
        <p>Needs a person? Nevian hands off the ticket with everything already in context.</p>
      </div>
      <div className="bento-handoff-agent">
        <span className="bento-handoff-avatar">AR</span>
        <span className="bento-handoff-meta">
          <b>Alex Rivera <i className="bento-handoff-online" /></b>
          <small>Senior IT Engineer</small>
        </span>
        <span className="bento-handoff-status">Assigned</span>
      </div>
      <ul className="bento-handoff-context">
        {shared.map((item) => (
          <li key={item}><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const bentoContent = {
  triage: <WorkloadVitals />,
  context: <DeviceContextTable />,
  identity: <IdentityVerify />,
  integrations: <IntegrationsPreview />,
  insights: <InsightsAnalytics />,
  security: <SecurityBar />,
  routing: <SmartRoutingGraph />,
  audit: <AuditTrail />,
  handoff: <HumanHandoff />,
};

const mobilePlatformLinks = [
  ['Platform overview', '/#features'],
  ['Workflow', '/#how'],
  ['Security', '/#password-reset'],
  ['Integrations', '/#integrations'],
];

// Bento cards mirror the reference layout: label + arrow anchored bottom-left,
// media area left open for real assets. Wording is drawn from the product.
const bentoCards = [
  { area: 'triage', label: 'Cut routine workload', href: '/#how' },
  { area: 'context', label: 'Device context', href: '/#features' },
  { area: 'identity', label: 'Identity verification', href: '/#password-reset' },
  { area: 'integrations', label: 'Integrations', href: '/#integrations' },
  { area: 'audit', label: 'Audit trail', href: '/#features' },
  { area: 'routing', label: 'Smart routing', href: '/#how' },
  { area: 'security', label: 'Security', href: '/#password-reset' },
  { area: 'insights', label: 'Insights', href: '/#how' },
  { area: 'handoff', label: 'Human handoff', href: '/#how' },
];

export default function ScratchLanding() {
  const [platformOpen, setPlatformOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
  const [demoRun, setDemoRun] = useState(0);
  const [workloadReduction, setWorkloadReduction] = useState(0);

  // GSAP-powered smooth scroll for in-page hash links (nav, platform menu, hero).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handleClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const raw = link.getAttribute('href') || '';
      const hashIndex = raw.indexOf('#');
      if (hashIndex < 0) return;
      const before = raw.slice(0, hashIndex);
      if (before && before !== '/') return; // link points to another page
      const hash = raw.slice(hashIndex);
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      gsap.to(window, {
        duration: reduce ? 0 : 0.9,
        ease: 'power2.inOut',
        scrollTo: { y: target, offsetY: 68 },
      });
      window.history.pushState(null, '', hash);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWorkloadReduction(60);
      return undefined;
    }

    const duration = 1400;
    const startedAt = performance.now();
    let frame = 0;

    const update = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      setWorkloadReduction(Math.round(60 * eased));
      if (progress < 1) frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="scratch-page">
      <nav className="scratch-nav" aria-label="Primary navigation">
        <a className="scratch-brand" href="/" aria-label="Nevian home">
          <img src="/assets/logo.png" alt="" />
          <span>Nevian</span>
        </a>
        <div className="scratch-links">
          <a href="/#top">Home</a>
          <a href="/#how">Workflow</a>
          <PlatformMenu
            active={false}
            open={platformOpen}
            onOpenChange={setPlatformOpen}
            onNavigate={() => setPlatformOpen(false)}
          />
          <a href="/process.html">Process</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="scratch-nav-actions">
          <a className="scratch-signup" href="#contact">Book a demo</a>
          <button
            className={`scratch-menu ${mobileOpen ? 'is-open' : ''}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          ><i /><i /></button>
        </div>
      </nav>

      <div className={`scratch-mobile-nav ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
        <a href="/#top">Home</a>
        <a href="/#how">Workflow</a>
        <button type="button" aria-expanded={mobilePlatformOpen} onClick={() => setMobilePlatformOpen((open) => !open)}>
          Platform <span>⌄</span>
        </button>
        <div className={`scratch-mobile-platform ${mobilePlatformOpen ? 'is-open' : ''}`}>
          {mobilePlatformLinks.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
        </div>
        <a href="/process.html">Process</a>
        <a href="#contact">Contact</a>
      </div>

      <section className="scratch-hero" id="top">
        <a className="scratch-release scratch-release-mobile" href="#how">Nevian AI <span>See it resolve a request</span><ArrowIcon /></a>
        <div className="scratch-hero-copy">
          <h1 aria-label="Cut routine IT workload by up to 60%">Cut routine IT workload by up to <strong aria-hidden="true">{workloadReduction}%</strong></h1>
          <p>Nevian combines identity, endpoint context, and policy-aware automation to resolve repetitive requests safely before they enter your team&apos;s queue.</p>
          <div className="scratch-actions">
            <a className="scratch-primary" href="#contact">Book a demo</a>
          </div>
        </div>
        <a className="scratch-release scratch-release-desktop" href="#how"><b>Nevian AI</b> Password reset, start to finish <ArrowIcon /></a>
      </section>

      <section className="scratch-stage" id="how" aria-label="Nevian password reset demo">
        <div className="scratch-browser">
          <div className="scratch-browser-bar">
            <div className="scratch-browser-dots"><i /><i /><i /></div>
            <div className="scratch-browser-address"><span aria-hidden="true">⌕</span> your-company.nevian-info.com/support</div>
            <div className="scratch-browser-tools">
              <button type="button" onClick={() => setDemoRun((run) => run + 1)} aria-label="Restart demo" title="Restart demo">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 6.5A6 6 0 1 0 16 12M15.5 3v3.5H12" /></svg>
              </button>
              <a href="#contact" aria-label="Open support" title="Open support">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 4h5v5M16 4l-7 7M15 11v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" /></svg>
              </a>
            </div>
          </div>
          <div className="scratch-demo"><PasswordResetDemo key={demoRun} /></div>
        </div>
      </section>

      <Integrations />

      <section className="scratch-bento" id="features" aria-label="The Nevian platform">
        <h2 className="scratch-bento-title">Not just a chatbot,<br />a full platform</h2>
        <div className="scratch-bento-grid">
          {bentoCards.map((card) => (
            <article key={card.area} className={`scratch-bento-card scratch-bento-${card.area}`}>
              <div className="scratch-bento-media">{bentoContent[card.area] || null}</div>
              <a className="scratch-bento-label" href={card.href}>{card.label} <ArrowIcon /></a>
            </article>
          ))}
        </div>
      </section>

      <ContactSection />
      <Footer showCta={false} />
    </main>
  );
}