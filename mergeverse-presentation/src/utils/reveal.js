/**
 * MERGEVERSE DESIGN SYSTEM — SCROLL REVEAL UTILITY (STEP 3)
 * Lightweight shared IntersectionObserver that adds `.is-visible` once to all `.reveal` elements.
 */
export function initScrollReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback for SSR or older browsers without IntersectionObserver
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
    });
    return null;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12,
    }
  );

  const targets = document.querySelectorAll('.reveal');
  targets.forEach((el) => observer.observe(el));

  return observer;
}
