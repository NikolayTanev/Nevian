import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScratchNav from './ScratchNav.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';
import { DeviceContextTable, OsMark } from './BentoVisuals.jsx';

gsap.registerPlugin(ScrollToPlugin);

// A single device profile: everything that rides along with a request.
function DeviceDetail() {
  const fields = [
    ['Owner', 'J. Okafor · Finance'],
    ['OS build', 'Windows 11 · 22631.4169'],
    ['Risk', 'Low'],
    ['Disk', '61% used'],
    ['Patches', 'Up to date'],
    ['Last seen', '2m ago'],
  ];
  return (
    <div className="dc-detail" aria-hidden="true">
      <div className="dc-detail-head">
        <OsMark meta="Windows 11 · Finance" className="dc-detail-avatar" />
        <div className="dc-detail-id">
          <b>NEV-LT-042</b>
          <small>Windows 11 · Finance</small>
        </div>
        <span className="dc-detail-badge"><i /> Healthy</span>
      </div>
      <div className="dc-detail-grid">
        {fields.map(([label, value]) => (
          <div className="dc-detail-field" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

// A support request with the device it came from attached automatically.
function RequestContext() {
  return (
    <div className="dc-request" aria-hidden="true">
      <div className="dc-request-bubble">I can’t sign in to the finance portal.</div>
      <div className="dc-request-chip">
        <OsMark meta="Windows 11 · Finance" className="dc-request-chip-icon" />
        <span className="dc-request-chip-body">
          <b>NEV-LT-042</b>
          <small>Windows 11 · Finance · Healthy · Low risk</small>
        </span>
        <span className="dc-request-chip-tag">Attached</span>
      </div>
    </div>
  );
}

// Fleet health distribution as thin share bars.
function HealthMix() {
  const rows = [
    { label: 'Healthy', fill: 82, tone: 'good' },
    { label: 'Patch pending', fill: 12, tone: 'warn' },
    { label: 'At risk', fill: 6, tone: 'bad' },
  ];
  return (
    <div className="dc-mix" aria-hidden="true">
      {rows.map((row) => (
        <div className="dc-mix-row" key={row.label}>
          <div className="dc-mix-head">
            <span>{row.label}</span>
            <strong>{row.fill}%</strong>
          </div>
          <div className={`dc-mix-bar is-${row.tone}`} style={{ '--fill': `${row.fill}%` }}><b /></div>
        </div>
      ))}
    </div>
  );
}

// Live device signals stream.
function SignalsFeed() {
  const signals = [
    ['Patch KB5039 applied', '2m'],
    ['Disk usage 61%', '9m'],
    ['New login · Finance app', '1h'],
    ['Reboot pending', '3h'],
  ];
  return (
    <div className="dc-signals" aria-hidden="true">
      <div className="dc-signals-head"><span>Signals</span><em>Live</em></div>
      <ul>
        {signals.map(([label, time]) => (
          <li key={label}><i /><span>{label}</span><time>{time}</time></li>
        ))}
      </ul>
    </div>
  );
}

// Fleet inventory count with a small breakdown.
function FleetInventory() {
  const breakdown = [['Laptops', 128], ['Desktops', 64], ['Servers', 12]];
  return (
    <div className="dc-inv" aria-hidden="true">
      <div className="dc-inv-total"><strong>204</strong><span>endpoints monitored</span></div>
      <ul>
        {breakdown.map(([label, value]) => (
          <li key={label}><span>{label}</span><b>{value}</b></li>
        ))}
      </ul>
    </div>
  );
}

// Run a system-level script on the device straight from Nevian — the endpoint
// agent executes it, so there's no SSH session or remote desktop needed.
function ScriptRunner() {
  return (
    <div className="dc-script" aria-hidden="true">
      <div className="dc-script-bar">
        <span className="dc-script-dot" /><span className="dc-script-dot" /><span className="dc-script-dot" />
        <span className="dc-script-name">reset-print-spooler.ps1</span>
        <span className="dc-script-lang">PowerShell</span>
      </div>
      <pre className="dc-script-code"><code>
        <span className="c"># Restart a stuck print spooler</span>{'\n'}
        <span className="k">Stop-Service</span> <span className="a">-Name</span> <span className="s">Spooler</span> <span className="a">-Force</span>{'\n'}
        <span className="k">Start-Service</span> <span className="a">-Name</span> <span className="s">Spooler</span>{'\n'}
        <span className="k">Write-Output</span> <span className="s">&quot;Spooler restarted&quot;</span>
      </code></pre>
      <div className="dc-script-run">
        <span className="dc-script-target">Target <b>NEV-LT-042</b> · +3 devices</span>
        <span className="dc-script-btn"><svg viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z" /></svg> Run as SYSTEM</span>
      </div>
    </div>
  );
}

// Reusable script presets, run on demand or on a schedule.
function ScriptPresets() {
  const presets = [
    ['Clear temp & cache', 'Daily · 02:00', 'sched'],
    ['Rotate local admin password', 'Weekly · Sun', 'sched'],
    ['Flush DNS cache', 'On demand', 'ondemand'],
    ['Install security patches', 'Sat · 01:00', 'sched'],
  ];
  return (
    <div className="dc-presets" aria-hidden="true">
      <div className="dc-presets-head"><span>Script presets</span><em>+ New</em></div>
      <ul>
        {presets.map(([name, when, kind]) => (
          <li key={name}>
            <span className="dc-presets-ico">
              <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 16h4" /></svg>
            </span>
            <span className="dc-presets-name">{name}</span>
            <span className={`dc-presets-when is-${kind}`}>{when}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const featurePanels = [
  {
    key: 'detail',
    span: 'wide',
    visual: <DeviceDetail />,
    title: 'The full device picture, on every ticket.',
    body: 'Identity, OS, health, risk, and recent activity travel with the request, so no one has to stop and ask which machine, which user, or what state it was in.',
  },
  {
    key: 'request',
    visual: <RequestContext />,
    title: 'Context attaches itself.',
    body: 'The moment a request arrives, Nevian links the device it came from, with no ticket ping-pong to gather the basics.',
  },
  {
    key: 'script',
    span: 'wide',
    visual: <ScriptRunner />,
    title: 'Run scripts at the system level, remotely.',
    body: 'Send a PowerShell or shell script to one device or a whole group and Nevian runs it as SYSTEM through the endpoint agent. No SSH, no remote desktop, no walking over to the machine. Every run is scoped to the right devices, policy-checked, and written to the audit log.',
  },
  {
    key: 'presets',
    visual: <ScriptPresets />,
    title: 'Save presets. Schedule the rest.',
    body: 'Turn any script into a reusable preset, then run it on demand or on a schedule: nightly cleanups, weekly maintenance, or the fix you keep reaching for.',
  },
  {
    key: 'mix',
    visual: <HealthMix />,
    title: 'Health and risk at a glance.',
    body: 'See how the fleet is doing without opening a separate monitoring tool.',
  },
  {
    key: 'signals',
    visual: <SignalsFeed />,
    title: 'Live signals, not stale snapshots.',
    body: 'Patch state, disk, logins, and reboots update as they happen.',
  },
  {
    key: 'inventory',
    visual: <FleetInventory />,
    title: 'Your whole fleet, in one place.',
    body: 'Laptops, desktops, and servers, continuously monitored.',
  },
];

// Framer "the list goes on" style: icon + short label, no description.
const listIcons = {
  inventory: <><path d="M3 8l9-4 9 4-9 4-9-4Z" /><path d="M3 8v8l9 4 9-4V8" /><path d="M12 12v8" /></>,
  health: <path d="M3 12h4l2-5 3 10 2-5h5" />,
  risk: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></>,
  patch: <><path d="M12 3v11m0 0 4-4m-4 4-4-4" /><path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" /></>,
  os: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18M8 21h8" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  owner: <><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
  location: <><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  apps: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  compliance: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9.5 12l1.8 1.8L15 10" /></>,
  network: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  hardware: <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" /></>,
  signals: <path d="M3 13l4-6 4 9 3-11 3 8h4" />,
  refresh: <><path d="M4 12a8 8 0 0 1 14-5.3L20 8M20 4v4h-4" /><path d="M20 12a8 8 0 0 1-14 5.3L4 16M4 20v-4h4" /></>,
  export: <><path d="M12 15V4m0 0 4 4m-4-4-4 4" /><path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" /></>,
};

const listItems = [
  ['inventory', 'Endpoint inventory'],
  ['health', 'Real-time health'],
  ['risk', 'Risk scoring'],
  ['patch', 'Patch status'],
  ['os', 'OS & build'],
  ['clock', 'Last seen'],
  ['owner', 'Owner & department'],
  ['location', 'Location'],
  ['apps', 'Installed apps'],
  ['compliance', 'Compliance state'],
  ['network', 'Network context'],
  ['hardware', 'Hardware specs'],
  ['signals', 'Signals feed'],
  ['refresh', 'Auto-refresh'],
  ['export', 'Export & share'],
];

export default function DeviceContextPage() {
  // Clean "/device-context" in the address bar (Pages serves the .html file).
  useEffect(() => {
    if (window.location.pathname.endsWith('/device-context.html')) {
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
        <h1>Every request arrives<br />with full device context</h1>
        <div className="feature-hero-actions">
          <a className="scratch-primary" href="#contact">Book a demo</a>
          <a className="scratch-secondary" href="/#how">See it resolve a request</a>
        </div>
      </section>

      <section className="device-showcase" aria-label="Device context dashboard">
        <div className="device-window">
          {/* The table's own toolbar (tabs + tools) doubles as the window bar. */}
          <div className="device-window-body">
            <DeviceContextTable interactive />
          </div>
        </div>
      </section>

      <section className="feature-bento" aria-label="How device context works">
        <h2 className="feature-caps-title feature-bento-title">Context you can act on</h2>
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

      <section className="feature-caps" aria-label="Everything that travels with a request">
        <h2 className="feature-caps-title">The context goes on</h2>
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
