import { useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal.js';

const logos = [
  { src: '/assets/integrations/servicenow.svg', alt: 'ServiceNow' },
  { src: '/assets/integrations/powershell.svg', alt: 'PowerShell' },
  { src: '/assets/integrations/windows-server.svg', alt: 'Windows Server' },
  { src: '/assets/integrations/microsoft-6.svg', alt: 'Microsoft' },
  { src: '/assets/integrations/azure-2.svg', alt: 'Microsoft Azure' },
  { src: '/assets/integrations/windows-darkblue-2012-svg.svg', alt: 'Windows' },
  { src: '/assets/integrations/azure-active-directory.svg', alt: 'Microsoft Entra ID' },
];

// Icon-only marks read small next to wordmarks, so scale them up a touch.
const big = (src) => /azure-2|azure-active-directory|powershell/.test(src);
const logoId = (src) => src.split('/').pop().replace('.svg', '');

// One track = the full logo set, each item carrying an equal right margin so
// the spacing across the seam between two tracks matches the inner spacing.
function Track({ ariaHidden }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {logos.map((l, i) => (
        <li key={`${l.alt}-${i}`} className="flex w-40 shrink-0 items-center justify-center px-2">
          <img
            src={l.src}
            alt={ariaHidden ? '' : l.alt}
            title={l.alt}
            data-logo={logoId(l.src)}
            className={`integration-logo ${big(l.src) ? 'integration-logo-mark' : ''}`}
          />
        </li>
      ))}
    </ul>
  );
}

export default function Integrations() {
  const [ref, shown] = useReveal();
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return undefined;
    if (!('IntersectionObserver' in window)) {
      marquee.classList.add('is-running');
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      marquee.classList.toggle('is-running', entry.isIntersecting);
    }, { threshold: 0 });

    observer.observe(marquee);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="integrations-band py-10">
      <div ref={ref} className={`wrap ${shown ? 'animate-fade-up' : 'opacity-0'}`}>
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-muted">
          Works with the tools your IT team already runs
        </p>

        {/* Seamless marquee: one moving row holds two identical tracks and
            slides exactly one track width (-50%), so the loop is continuous
            with no reset. Each track is wider than the visible column, so the
            same logo is never on screen twice at once. Edges fade to the page
            background via a mask. */}
        <div ref={marqueeRef} className="logo-marquee group relative flex overflow-hidden [-webkit-mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]">
          <div className="logo-track-move flex w-max flex-nowrap">
            <Track />
            <Track ariaHidden />
          </div>
        </div>
      </div>
    </section>
  );
}
