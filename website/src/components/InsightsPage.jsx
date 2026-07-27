import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScratchNav from './ScratchNav.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';

gsap.registerPlugin(ScrollToPlugin);

const todayLabel = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Build a line + area path from raw values, scaled into a 0..w / 0..h box.
function buildSeries(values, { w = 600, h = 200, peak } = {}) {
  const top = peak ?? Math.max(...values) * 1.12;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => `${(i * step).toFixed(1)} ${(h - (v / top) * h).toFixed(1)}`);
  const line = `M ${pts.join(' L ')}`;
  return { line, area: `${line} L ${w} ${h} L 0 ${h} Z` };
}

const automatedSeries = [120, 180, 150, 220, 265, 210, 300, 280, 345, 360, 320, 415, 435, 400, 475, 525];
const resolvedSeries = [95, 130, 112, 165, 185, 150, 215, 235, 205, 255, 245, 305, 325, 295, 345, 385];

function InsightsChart({ withTooltip = true }) {
  const peak = Math.max(...automatedSeries) * 1.15;
  const a = buildSeries(automatedSeries, { peak });
  const r = buildSeries(resolvedSeries, { peak });
  return (
    <div className="ins-chart">
      <span className="ins-chart-axis ins-chart-axis-top">600</span>
      <span className="ins-chart-axis ins-chart-axis-mid">300</span>
      <svg viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="insArea1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#57e39b" stopOpacity=".42" />
            <stop offset="1" stopColor="#57e39b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="insArea2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3fd0d8" stopOpacity=".28" />
            <stop offset="1" stopColor="#3fd0d8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line className="ins-chart-grid" x1="0" y1="66" x2="600" y2="66" />
        <line className="ins-chart-grid" x1="0" y1="133" x2="600" y2="133" />
        <path d={a.area} fill="url(#insArea1)" />
        <path d={r.area} fill="url(#insArea2)" />
        <path className="ins-chart-line2" d={r.line} />
        <path className="ins-chart-line1" d={a.line} />
      </svg>
      <div className="ins-chart-dates"><span>30 days ago</span><span>Today</span></div>
      {withTooltip && (
        <div className="ins-chart-tip">
          <span>{todayLabel()}</span>
          <div><i className="ins-dot1" /> Automated <b>525</b></div>
          <div><i className="ins-dot2" /> Resolved <b>385</b></div>
        </div>
      )}
    </div>
  );
}

const stats = [
  { label: 'Active tickets', value: '11', live: true },
  { label: 'Resolved · 30d', value: '842' },
  { label: 'Auto-resolved', value: '60%' },
  { label: 'Avg. first response', value: '1.2s' },
  { label: 'CSAT', value: '4.8/5', muted: true },
];

function StatRow() {
  return (
    <div className="ins-stats">
      {stats.map((s) => (
        <div key={s.label} className={s.muted ? 'is-muted' : ''}>
          <span>{s.label}{s.live && <i className="ins-live" />}</span>
          <strong>{s.value}</strong>
        </div>
      ))}
    </div>
  );
}

function StatList({ title, action, rows }) {
  return (
    <div className="ins-list">
      <div className="ins-list-head"><span>{title}</span>{action && <em>{action}</em>}</div>
      <ul>
        {rows.map(([label, value, pct]) => (
          <li key={label} style={{ '--pct': `${pct}%` }}>
            <span className="ins-list-label">{label}</span>
            <span className="ins-list-val">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const requestTypes = [
  ['Password & MFA resets', '312', 100],
  ['Access requests', '214', 69],
  ['Software installs', '168', 54],
  ['Account setup', '96', 31],
  ['Other', '52', 17],
];
const resolution = [
  ['Auto-resolved', '60%', 100],
  ['Desk Agent', '22%', 37],
  ['Server Agent', '11%', 18],
  ['Human handoff', '7%', 12],
];
const teams = [
  ['Finance', '268', 100],
  ['Sales', '201', 75],
  ['Engineering', '176', 66],
  ['Support', '132', 49],
  ['Ops', '65', 24],
];
const deviceOs = [
  ['Windows 11', '612', 100],
  ['Windows Server', '96', 16],
  ['macOS', '84', 14],
  ['Other', '50', 8],
];

function InsightsDashboard() {
  return (
    <div className="device-window ins-window">
      <div className="device-window-bar">
        <div className="device-window-title">Support analytics · <b>Overview</b></div>
        <div className="device-window-actions">
          <span className="ins-range">Last 30 days</span>
          <span className="ins-range is-ghost">{todayLabel()}</span>
        </div>
      </div>
      <div className="ins-body">
        <StatRow />
        <InsightsChart />
        <div className="ins-split">
          <StatList title="Top request types" action="Volume" rows={requestTypes} />
          <StatList title="How it resolved" action="Share" rows={resolution} />
        </div>
        <div className="ins-split">
          <StatList title="By team" action="Tickets" rows={teams} />
          <StatList title="By device" action="Tickets" rows={deviceOs} />
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    key: 'oneplace',
    title: 'Every metric that matters, in one place.',
    body: 'Volume, automation rate, response time, and backlog, updated as tickets move. No exports, no stitching spreadsheets together.',
    visual: <div className="ins-mini"><StatRow /><InsightsChart withTooltip={false} /></div>,
  },
  {
    key: 'trends',
    flip: true,
    title: 'Spot a spike before it becomes a backlog.',
    body: 'Watch volume and automation trend day by day, and see the automated share keep pace as requests climb.',
    visual: <div className="ins-mini ins-mini-chart"><InsightsChart /></div>,
  },
  {
    key: 'slice',
    title: 'Slice it any way you need.',
    body: 'Break results down by team, request type, and device to see where the time actually goes, then act on it.',
    visual: (
      <div className="ins-mini ins-mini-lists">
        <StatList title="By team" action="Tickets" rows={teams} />
        <StatList title="Top request types" action="Volume" rows={requestTypes.slice(0, 4)} />
      </div>
    ),
  },
];

const measureIcons = {
  volume: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  auto: <path d="M4 12l5 5L20 6" />,
  speed: <><circle cx="12" cy="13" r="8" /><path d="M12 13V9M12 3h0M9 3h6" /></>,
  backlog: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
  csat: <path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.7l5.4-.8z" />,
  sla: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  team: <><circle cx="9" cy="9" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 8a3 3 0 0 1 0 6M21 19a5 5 0 0 0-4-4.9" /></>,
  app: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  device: <><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M9 20h6m-3-3.5V20" /></>,
  trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
};
const measures = [
  ['volume', 'Ticket volume'],
  ['auto', 'Auto-resolve rate'],
  ['speed', 'First response'],
  ['sla', 'Time to resolve'],
  ['backlog', 'Open backlog'],
  ['csat', 'CSAT'],
  ['team', 'By team'],
  ['app', 'By request type'],
  ['device', 'By device'],
  ['trend', 'Trends over time'],
];

export default function InsightsPage() {
  useEffect(() => {
    if (window.location.pathname.endsWith('/insights.html')) {
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
        <h1>See where the work goes</h1>
        <div className="feature-hero-actions">
          <a className="scratch-primary" href="#contact">Book a demo</a>
          <a className="scratch-secondary" href="/#how">See it resolve a request</a>
        </div>
      </section>

      <section className="ins-showcase" aria-label="Support analytics dashboard">
        <InsightsDashboard />
      </section>

      <section className="ins-features" aria-label="What Nevian insights give you">
        {features.map((f) => (
          <div className={`ins-feature ${f.flip ? 'is-flip' : ''}`} key={f.key}>
            <div className="ins-feature-copy">
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <a className="ins-feature-link" href="#contact">Book a demo
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>
              </a>
            </div>
            <div className="ins-feature-visual">{f.visual}</div>
          </div>
        ))}
      </section>

      <section className="feature-caps" aria-label="What you can measure">
        <h2 className="feature-caps-title">Everything you can measure</h2>
        <div className="device-list-grid">
          {measures.map(([icon, label]) => (
            <div className="device-list-cell" key={label}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{measureIcons[icon]}</svg>
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
