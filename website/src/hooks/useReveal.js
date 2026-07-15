import { useEffect, useRef, useState } from 'react';

// Adds a fade-up when the element scrolls into view (once).
export function useReveal(options = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px', ...options }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, options]);

  return [ref, shown];
}
