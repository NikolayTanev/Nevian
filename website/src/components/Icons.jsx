// Small stroke-based icon set (my own SVG paths, no external deps).
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconChat = (p) => (
  <svg {...base} {...p}><path d="M5 5h14v10H8l-3 3V5Z" /><path d="M9 9h6M9 12h4" /></svg>
);
export const IconDevice = (p) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
);
export const IconShield = (p) => (
  <svg {...base} {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>
);
export const IconGrid = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1.4" /><rect x="14" y="3" width="7" height="7" rx="1.4" /><rect x="3" y="14" width="7" height="7" rx="1.4" /><rect x="14" y="14" width="7" height="7" rx="1.4" /></svg>
);
export const IconBolt = (p) => (
  <svg {...base} {...p}><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8Z" /></svg>
);
export const IconCheck = (p) => (
  <svg {...base} {...p}><path d="M20 6L9 17l-5-5" /></svg>
);
export const IconArrow = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconChevron = (p) => (
  <svg {...base} {...p}><path d="M6 9l6 6 6-6" /></svg>
);
export const IconMenu = (p) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconClose = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
