import { useReveal } from '../hooks/useReveal.js';

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

function DiagramNode({ className, icon, children, delay = 0 }) {
  return (
    <div className={`architecture-node ${className}`} style={{ '--node-delay': `${delay}ms` }}>
      <span className="architecture-node-icon"><LineIcon type={icon} /></span>
      <strong>{children}</strong>
    </div>
  );
}

function FlowLines() {
  return (
    <svg className="architecture-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
      <g className="architecture-line-paths">
        <path d="M350 54V174" />
        <path d="M760 54V174" />
        <path d="M350 228V255H520V279" />
        <path d="M760 228V255H520" />
        <path d="M104 330H470" />
        <path d="M570 330H940" />
        <path d="M520 380V430" />
        <path d="M520 485V515H355V540M520 515H690V540" />
      </g>

      <g className="architecture-junctions">
        <circle cx="520" cy="255" r="3.5" />
        <circle cx="570" cy="330" r="4" />
        <circle cx="520" cy="515" r="3.5" />
      </g>

      <g className="architecture-flow-dots">
        <circle r="3"><animateMotion dur="7.2s" repeatCount="indefinite" path="M350 228V255H520" /></circle>
        <circle r="3"><animateMotion dur="8.4s" begin="-3.1s" repeatCount="indefinite" path="M104 330H470" /></circle>
      </g>
    </svg>
  );
}

export default function Architecture() {
  const [ref, shown] = useReveal({ threshold: 0.12 });

  return (
    <section id="features" className={`architecture-section ${shown ? 'is-visible' : ''}`}>
      <div ref={ref} className="architecture-wrap">
        <div className="architecture-copy">
          <h2>From user ticket to admin action, Nevian keeps the workflow moving.</h2>
        </div>

        <div className="architecture-diagram" aria-label="Nevian infrastructure workflow diagram">
          <FlowLines />

          <div className="architecture-tabs architecture-node" style={{ '--node-delay': '80ms' }}>
            <span>Workstations</span>
            <span>Servers</span>
            <span>Domain Controllers</span>
            <span>M365 Tenant</span>
          </div>

          <div className="architecture-source-grid architecture-node" style={{ '--node-delay': '180ms' }}>
            {['shield', 'network', 'archive', 'cloud'].map((type) => (
              <span key={type}><LineIcon type={type} /></span>
            ))}
          </div>

          <DiagramNode className="architecture-gateway" icon="gateway" delay={240}>Agent Gateway</DiagramNode>
          <DiagramNode className="architecture-event" icon="event" delay={300}>Event Stream</DiagramNode>
          <DiagramNode className="architecture-hub" icon="hub" delay={360}>Integration Hub</DiagramNode>

          <div className="architecture-core architecture-node" style={{ '--node-delay': '420ms' }}>
            <img src="/assets/logo.png" alt="Nevian" />
          </div>

          <div className="architecture-database architecture-node" style={{ '--node-delay': '480ms' }}>
            <LineIcon type="database" />
          </div>

          <DiagramNode className="architecture-orchestration" icon="orchestration" delay={520}>Orchestration</DiagramNode>
          <DiagramNode className="architecture-desk" icon="monitor" delay={590}>Desk Agent</DiagramNode>
          <DiagramNode className="architecture-server" icon="lock" delay={650}>Server Agent</DiagramNode>
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
