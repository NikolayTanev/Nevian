import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';

const tabVariants = [
  ['Workstations', 'User devices', 'Endpoints'],
  ['Servers', 'Server fleet', 'Infrastructure'],
  ['Domain Controllers', 'Identity services', 'Active Directory'],
  ['M365 Tenant', 'Cloud workspace', 'Microsoft 365'],
];

function LineIcon({ type }) {
  const paths = {
    gateway: <><path d="M12 15V4m0 0L8 8m4-4 4 4" /><path d="M5 13v5h14v-5" /></>,
    event: <path d="m13.5 2-7 10H12l-1.5 10 7-11H12l1.5-9Z" />,
    hub: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    orchestration: <><path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8" /><circle cx="12" cy="12" r="2.5" /></>,
    monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    database: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" /></>,
    shield: <path d="M12 3 5 6v5c0 4.6 2.9 8 7 10 4.1-2 7-5.4 7-10V6l-7-3Z" />,
    network: <><circle cx="12" cy="5" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="M12 7v5m0 0-7 4m7-4 7 4" /></>,
    archive: <><path d="M4 7h16v13H4zM3 3h18v4H3z" /><path d="M9 12h6" /></>,
    cloud: <path d="M7 19h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6.4 9.4 4.8 4.8 0 0 0 7 19Z" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

function NodeTooltip({ children }) {
  return (
    <div className="architecture-node-tooltip" aria-hidden="true">
      <p>{children}</p>
    </div>
  );
}

function DiagramNode({ className, icon, children, description, delay = 0 }) {
  return (
    <div
      className={`architecture-node ${className}`}
      style={{ '--node-delay': `${delay}ms` }}
      tabIndex={0}
      aria-label={`${children}. ${description}`}
    >
      <span className="architecture-node-icon"><LineIcon type={icon} /></span>
      <strong>{children}</strong>
      <NodeTooltip>{description}</NodeTooltip>
    </div>
  );
}

function FlowLines() {
  return (
    <svg className="architecture-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
      <g className="architecture-line-paths">
        <path d="M350 54V174" />
        <path d="M760 54V174" />
        <path d="M350 228V255H660V279" />
        <path d="M760 228V255H660" />
        <path d="M104 330H610" />
        <path d="M710 330H940" />
        <path d="M660 380V405H520V430" />
        <path d="M520 485V515H355V540M520 515H690V540" />
      </g>

      <g className="architecture-junctions">
        <circle cx="660" cy="255" r="3.5" />
        <circle cx="710" cy="330" r="4" />
        <circle cx="520" cy="515" r="3.5" />
      </g>

      <g className="architecture-flow-dots">
        <circle r="3"><animateMotion dur="6.8s" begin="-1.2s" calcMode="paced" repeatCount="indefinite" path="M350 54V174" /></circle>
        <circle r="3"><animateMotion dur="7.4s" begin="-4.3s" calcMode="paced" repeatCount="indefinite" path="M760 54V174" /></circle>
        <circle r="3"><animateMotion dur="7.2s" begin="-2.6s" calcMode="paced" repeatCount="indefinite" path="M350 228V255H660V279" /></circle>
        <circle r="3"><animateMotion dur="7.8s" begin="-5.1s" calcMode="paced" repeatCount="indefinite" path="M760 228V255H660" /></circle>
        <circle r="3"><animateMotion dur="8.4s" begin="-3.1s" calcMode="paced" repeatCount="indefinite" path="M104 330H610" /></circle>
        <circle r="3"><animateMotion dur="6.9s" begin="-4.7s" calcMode="paced" repeatCount="indefinite" path="M710 330H940" /></circle>
        <circle r="3"><animateMotion dur="7.6s" begin="-1.8s" calcMode="paced" repeatCount="indefinite" path="M660 380V405H520V430" /></circle>
        <circle r="3"><animateMotion dur="8.1s" begin="-5.8s" calcMode="paced" repeatCount="indefinite" path="M520 485V515H355V540" /></circle>
        <circle r="3"><animateMotion dur="7.7s" begin="-3.9s" calcMode="paced" repeatCount="indefinite" path="M520 515H690V540" /></circle>
      </g>
    </svg>
  );
}

export default function Architecture() {
  const [ref, shown] = useReveal({ threshold: 0.12 });
  const [tabLabels, setTabLabels] = useState(() => tabVariants.map(([label]) => label));
  const [tabMotion, setTabMotion] = useState({ index: -1, phase: '' });
  const variantIndexesRef = useRef(tabVariants.map(() => 0));

  useEffect(() => {
    if (!shown || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let tabIndex = 0;
    let swapTimer = 0;
    let settleTimer = 0;

    const interval = window.setInterval(() => {
      const switchingIndex = tabIndex;
      setTabMotion({ index: switchingIndex, phase: 'out' });

      swapTimer = window.setTimeout(() => {
        variantIndexesRef.current[switchingIndex] =
          (variantIndexesRef.current[switchingIndex] + 1) % tabVariants[switchingIndex].length;

        setTabLabels((current) => current.map((label, index) => (
          index === switchingIndex
            ? tabVariants[index][variantIndexesRef.current[index]]
            : label
        )));
        setTabMotion({ index: switchingIndex, phase: 'in' });

        settleTimer = window.setTimeout(() => {
          setTabMotion({ index: -1, phase: '' });
        }, 380);

        tabIndex = (tabIndex + 1) % tabVariants.length;
      }, 210);
    }, 2900);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(swapTimer);
      window.clearTimeout(settleTimer);
    };
  }, [shown]);

  return (
    <section id="features" className={`architecture-section ${shown ? 'is-visible' : ''}`}>
      <div ref={ref} className="architecture-wrap">
        <div className="architecture-copy">
          <h2>From user ticket to admin action, Nevian keeps the workflow moving.</h2>
        </div>

        <div className="architecture-diagram" aria-label="Nevian infrastructure workflow diagram">
          <FlowLines />

          <div className="architecture-tabs architecture-node" style={{ '--node-delay': '80ms' }}>
            {tabLabels.map((label, index) => (
              <span
                className={`architecture-tab ${tabMotion.index === index ? `is-${tabMotion.phase}` : ''}`}
                key={index}
              >
                <span className="architecture-tab-text">{label}</span>
              </span>
            ))}
          </div>

          <div
            className="architecture-source-grid architecture-node"
            style={{ '--node-delay': '180ms' }}
            tabIndex={0}
            aria-label="Connected systems. Identity, monitoring, ticketing, and cloud tools connect here."
          >
            {['shield', 'network', 'archive', 'cloud'].map((type) => (
              <span key={type}><LineIcon type={type} /></span>
            ))}
            <NodeTooltip>Identity, monitoring, ticketing, and cloud tools connect here.</NodeTooltip>
          </div>

          <DiagramNode className="architecture-gateway" icon="gateway" delay={240} description="Securely carries device context and approved jobs between your environment and Nevian.">Agent Gateway</DiagramNode>
          <DiagramNode className="architecture-event" icon="event" delay={300} description="Routes live support signals and operational events to the right workflow in real time.">Event Stream</DiagramNode>
          <DiagramNode className="architecture-hub" icon="hub" delay={360} description="Connects the tools your IT team already uses without replacing the existing stack.">Integration Hub</DiagramNode>

          <div
            className="architecture-core architecture-node"
            style={{ '--node-delay': '420ms' }}
            tabIndex={0}
            aria-label="Nevian core. Correlates context, policy, and intent before choosing the next safe action."
          >
            <img src="/assets/logo.png" alt="Nevian" />
            <NodeTooltip>Correlates context, policy, and intent before choosing the next safe action.</NodeTooltip>
          </div>

          <div
            className="architecture-database architecture-node"
            style={{ '--node-delay': '480ms' }}
            tabIndex={0}
            aria-label="Audit store. Keeps workflow state, results, and audit history visible."
          >
            <LineIcon type="database" />
            <NodeTooltip>Keeps workflow state, results, and audit history visible.</NodeTooltip>
          </div>

          <DiagramNode className="architecture-orchestration" icon="orchestration" delay={520} description="Coordinates approved actions, dependencies, retries, and the complete audit trail.">Orchestration</DiagramNode>
          <DiagramNode className="architecture-desk" icon="monitor" delay={590} description="Collects live endpoint context and executes signed fixes on user devices.">Desk Agent</DiagramNode>
          <DiagramNode className="architecture-server" icon="lock" delay={650} description="Runs controlled automation on servers without opening inbound access.">Server Agent</DiagramNode>
        </div>

        <div className="architecture-mobile-flow" aria-label="Nevian workflow">
          <div className="architecture-mobile-core"><img src="/assets/logo.png" alt="Nevian" /></div>
          {['User endpoints', 'Agent Gateway', 'Nevian Orchestration', 'Desk & Server Agents'].map((label, index) => (
            <div className="architecture-mobile-step" key={label} style={{ '--node-delay': `${index * 100 + 120}ms` }}>
              <span>{String(index + 1).padStart(2, '0')}</span>{label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
