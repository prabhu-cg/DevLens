import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Smoothly scrolls to the element matching the current URL hash, once the route settles. */
export function useHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, [hash]);
}
