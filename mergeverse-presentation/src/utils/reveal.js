/**
 * MERGEVERSE DESIGN SYSTEM — SCROLL REVEAL UTILITY (STEP 3 & 5)
 * Lightweight shared IntersectionObserver that adds `.is-visible` once to all `.reveal` elements,
 * with immediate viewport evaluation and safety net fallback.
 */
export function initScrollReveal() {
  if (typeof window === 'undefined') return null;

  const revealAll = () => {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
    });
  };

  if (!('IntersectionObserver' in window)) {
    revealAll();
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
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05,
    }
  );

  const targets = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;

  targets.forEach((el) => {
    // If element is already in or above viewport, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });

  // Safety net 1: after short delay, reveal any elements that entered viewport
  const safetyTimer = setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.3) {
        el.classList.add('is-visible');
      }
    });
  }, 450);

  // Safety net 2: scroll listener fallback in case observer misses tall sections
  const handleScrollFallback = () => {
    const unrevealed = document.querySelectorAll('.reveal:not(.is-visible)');
    if (unrevealed.length === 0) {
      window.removeEventListener('scroll', handleScrollFallback);
      return;
    }
    const wh = window.innerHeight;
    unrevealed.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < wh * 1.15 && rect.bottom > -50) {
        el.classList.add('is-visible');
      }
    });
  };

  window.addEventListener('scroll', handleScrollFallback, { passive: true });

  // Safety net 3: timeout fallback guaranteeing elements are never stuck
  setTimeout(() => {
    handleScrollFallback();
  }, 1000);

  // Safety net 4: absolute timeout fallback guaranteeing 100% visibility for all elements
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      el.classList.add('is-visible');
    });
  }, 2200);

  return observer;
}
