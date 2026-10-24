/**
 * ============================================================================
 * STICKY + PROGRESS SCENE ARCHITECTURE (STEP 9)
 * ============================================================================
 * 1. The outer wrapper is sized to (stages * 90vh + 100vh) in CSS when .is-scene is active,
 *    creating a physical scroll track through which the user travels.
 * 2. The inner container uses `position: sticky; top: 0; height: 100vh; overflow: hidden;`
 *    so it locks into the viewport while the user scrolls through the wrapper's height.
 * 3. As the user scrolls, JavaScript calculates the normalized progress (0.0 to 1.0) and
 *    the active stage index (0 to stages - 1), updating `--p` and `data-stage` on the DOM wrapper.
 * 4. CSS animations, transforms, card fly-ins, and highlight glows are driven by `--p`
 *    and `data-stage`, allowing hardware-accelerated animations and natural forward/reverse scrubbing.
 * 5. Safe Default: When viewport < 1024px or prefers-reduced-motion is true, .is-scene is NOT added.
 *    The wrapper stays height: auto, sticky behavior is off, and all sections display normally.
 * ============================================================================
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useScrollScene hook
 * @param {React.RefObject} wrapperRef - Ref to the outer scene wrapper element
 * @param {Object} options
 * @param {number} options.stages - Number of distinct stages in the scene (e.g. 3 or 4)
 * @returns {{ isSceneActive: boolean, progress: number, stage: number, scrollToStage: Function }}
 */
export function useScrollScene(wrapperRef, { stages = 3 } = {}) {
  const [isSceneActive, setIsSceneActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const isNearScreenRef = useRef(false);
  const rafIdRef = useRef(null);
  const stagesRef = useRef(stages);
  stagesRef.current = stages;

  // Determine if scene pinning should be enabled: >= 1024px and no prefers-reduced-motion
  const checkShouldEnable = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const isWideEnough = window.innerWidth >= 1024;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return isWideEnough && !prefersReducedMotion;
  }, []);

  // Update progress (0.0 to 1.0) and stage (0 to stages - 1)
  const updateProgress = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const totalDist = el.offsetHeight - vh;

    if (totalDist <= 0) {
      setProgress(0);
      setStage(0);
      el.style.setProperty('--p', '0');
      el.setAttribute('data-stage', '0');
      return;
    }

    // rect.top <= 0 indicates wrapper top has met or scrolled past the viewport top
    const scrolled = -rect.top;
    const p = Math.max(0, Math.min(1, scrolled / totalDist));
    const roundedP = Number(p.toFixed(4));

    const totalStages = stagesRef.current;
    const rawStage = Math.floor(p * totalStages);
    const activeStage = Math.min(totalStages - 1, Math.max(0, rawStage));

    setProgress(roundedP);
    setStage(activeStage);

    el.style.setProperty('--p', roundedP.toString());
    el.setAttribute('data-stage', activeStage.toString());

    // Flag for end of scene when all items return to normal (progress >= 0.92)
    if (roundedP >= 0.92) {
      el.setAttribute('data-all-normal', 'true');
    } else {
      el.removeAttribute('data-all-normal');
    }
  }, [wrapperRef]);

  // Smoothly scroll to the matching position for a specific stage
  const scrollToStage = useCallback(
    (targetStage) => {
      const el = wrapperRef.current;
      if (!el) return;

      const totalStages = stagesRef.current;
      const clampedStage = Math.max(0, Math.min(totalStages - 1, targetStage));
      const vh = window.innerHeight;
      const totalDist = el.offsetHeight - vh;

      // Position the scroll near the center of the target stage
      const targetP = (clampedStage + 0.5) / totalStages;
      const elTopDoc = el.getBoundingClientRect().top + window.scrollY;
      const targetY = elTopDoc + targetP * totalDist;

      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    },
    [wrapperRef]
  );

  // Keyboard accessibility: if a focused element belongs to a stage not shown, scroll to that stage
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || !isSceneActive) return;

    const handleFocusIn = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;

      const stageEl = target.closest('[data-scene-stage]');
      if (stageEl) {
        const focusedStage = parseInt(stageEl.getAttribute('data-scene-stage'), 10);
        if (!isNaN(focusedStage) && focusedStage !== stage) {
          scrollToStage(focusedStage);
        }
      }
    };

    el.addEventListener('focusin', handleFocusIn);
    return () => el.removeEventListener('focusin', handleFocusIn);
  }, [wrapperRef, isSceneActive, stage, scrollToStage]);

  // Main lifecycle: monitor viewport resize, reduced-motion changes, and scroll
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let mediaQueryList = null;

    const handleResizeOrMedia = () => {
      const shouldEnable = checkShouldEnable();
      setIsSceneActive((prev) => {
        if (prev !== shouldEnable) {
          if (shouldEnable) {
            el.classList.add('is-scene');
            el.setAttribute('data-scene-stages', stagesRef.current.toString());
            el.style.setProperty('--scene-stages', stagesRef.current.toString());
            updateProgress();
          } else {
            el.classList.remove('is-scene');
            el.style.removeProperty('--p');
            el.style.removeProperty('--scene-stages');
            el.removeAttribute('data-stage');
            el.removeAttribute('data-scene-stages');
            el.removeAttribute('data-all-normal');
          }
        }
        return shouldEnable;
      });
    };

    handleResizeOrMedia();
    window.addEventListener('resize', handleResizeOrMedia, { passive: true });

    if (window.matchMedia) {
      mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', handleResizeOrMedia);
      }
    }

    // IntersectionObserver so scroll calculation runs only when near screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearScreenRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateProgress();
        }
      },
      { rootMargin: '250px 0px 250px 0px' }
    );

    observer.observe(el);

    // Passive scroll listener driven by requestAnimationFrame
    const onScroll = () => {
      if (!isNearScreenRef.current) return;
      if (rafIdRef.current) return;

      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateProgress();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResizeOrMedia);
      window.removeEventListener('scroll', onScroll);
      if (mediaQueryList?.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleResizeOrMedia);
      }
      observer.disconnect();
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      el.classList.remove('is-scene');
      el.style.removeProperty('--p');
      el.style.removeProperty('--scene-stages');
      el.removeAttribute('data-stage');
      el.removeAttribute('data-scene-stages');
      el.removeAttribute('data-all-normal');
    };
  }, [wrapperRef, checkShouldEnable, updateProgress]);

  return { isSceneActive, progress, stage, scrollToStage };
}
