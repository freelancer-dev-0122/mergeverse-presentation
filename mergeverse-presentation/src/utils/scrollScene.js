/**
 * ============================================================================
 * STICKY + PROGRESS SCENE ARCHITECTURE (STEP 9 - FIT TO SCREEN REFINEMENT)
 * ============================================================================
 * 1. SCENES_ENABLED flag toggles the entire scroll-scene system. If false,
 *    every section scrolls normally in standard document flow.
 * 2. Scene mode runs ONLY if:
 *    - SCENES_ENABLED is true
 *    - innerWidth >= 1024
 *    - innerHeight >= 720
 *    - prefers-reduced-motion is false
 * 3. FIT TO SCREEN:
 *    - The sticky container uses height: 100svh (fallback 100vh).
 *    - Content natural height is measured with a ResizeObserver.
 *    - A CSS variable --fit = min(1, containerHeight / contentHeight) is set.
 *    - CSS applies transform: scale(var(--fit)) with transform-origin: top center.
 *    - If --fit < 0.75 for a scene, scene mode is turned OFF for that scene (normal flow).
 * 4. NO BLANK ZONES:
 *    - Base content is visible at progress 0 and remains visible throughout.
 *    - The wrapper height is exactly (stages * 80vh + 100vh), with no extra margins or padding.
 * ============================================================================
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export const SCENES = {
  laptop: true,
  ocean: false,
  gameplay: true,
};

export const SCENES_ENABLED = true;

/**
 * useScrollScene hook
 * @param {React.RefObject} wrapperRef - Ref to the outer scene wrapper element
 * @param {Object} options
 * @param {number} options.stages - Number of distinct stages in the scene (e.g. 3 or 4)
 * @param {string} [options.contentSelector] - Optional selector for the content card to fit
 * @param {string} [options.scene] - Scene key ('laptop' | 'ocean' | 'gameplay')
 * @param {boolean} [options.enabled] - Explicit enable flag
 * @returns {{ isSceneActive: boolean, progress: number, stage: number, scrollToStage: Function }}
 */
export function useScrollScene(wrapperRef, { stages = 3, contentSelector = null, scene = null, enabled = true } = {}) {
  const [isSceneActive, setIsSceneActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const isNearScreenRef = useRef(false);
  const rafIdRef = useRef(null);
  const stagesRef = useRef(stages);
  stagesRef.current = stages;
  const isSceneActiveRef = useRef(false);

  // Scene mode runs ONLY if:
  // SCENES[scene] !== false AND enabled AND innerWidth >= 1024 AND innerHeight >= 720 AND reduced motion is off
  const checkShouldEnable = useCallback(() => {
    if (!SCENES_ENABLED) return false;
    if (scene && SCENES[scene] === false) return false;
    if (!enabled) return false;
    if (typeof window === 'undefined') return false;
    const isWideEnough = window.innerWidth >= 1024;
    const isTallEnough = window.innerHeight >= 720;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return isWideEnough && isTallEnough && !prefersReducedMotion;
  }, [scene, enabled]);

  // Update progress (0.0 to 1.0) and stage (0 to stages - 1)
  const updateProgress = useCallback(() => {
    const el = wrapperRef.current;
    if (!el || !el.classList.contains('is-scene')) return;

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

  // Evaluate fit-to-screen and scene activation
  const evaluateFitAndScene = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const shouldEnable = checkShouldEnable();
    const stickyEl = el.querySelector('.scene-sticky-inner');
    const contentEl = contentSelector
      ? el.querySelector(contentSelector)
      : el.querySelector('.scene-fit-content, .cream-slider-outer-card, .ocean-content-wrapper, .gameplay-cards-outer-card');

    if (!shouldEnable) {
      if (el.classList.contains('is-scene')) {
        el.classList.remove('is-scene');
        el.style.removeProperty('--p');
        el.style.removeProperty('--scene-stages');
        el.style.removeProperty('--fit');
        el.removeAttribute('data-stage');
        el.removeAttribute('data-scene-stages');
        el.removeAttribute('data-all-normal');
      }
      if (stickyEl) stickyEl.style.removeProperty('--fit');
      if (contentEl) contentEl.style.removeProperty('--fit');
      isSceneActiveRef.current = false;
      setIsSceneActive(false);
      return;
    }

    // Container uses height: 100svh
    const containerHeight =
      stickyEl && el.classList.contains('is-scene') && stickyEl.clientHeight > 0
        ? stickyEl.clientHeight
        : window.innerHeight;

    // Content natural height
    let contentHeight = 0;
    if (contentEl) {
      contentHeight = Math.max(contentEl.scrollHeight, contentEl.offsetHeight);
    }

    // Calculate fit ratio: min(1, containerHeight / contentHeight)
    let fitRatio = 1;
    if (containerHeight > 0 && contentHeight > 0) {
      fitRatio = Math.min(1, containerHeight / contentHeight);
    }

    const roundedFit = Number(fitRatio.toFixed(3));

    // If --fit is below 0.75 for a scene, turn scene mode OFF for that scene (normal flow)
    if (roundedFit < 0.75) {
      if (el.classList.contains('is-scene')) {
        el.classList.remove('is-scene');
        el.style.removeProperty('--p');
        el.style.removeProperty('--scene-stages');
        el.style.removeProperty('--fit');
        el.removeAttribute('data-stage');
        el.removeAttribute('data-scene-stages');
        el.removeAttribute('data-all-normal');
      }
      if (stickyEl) stickyEl.style.removeProperty('--fit');
      if (contentEl) contentEl.style.removeProperty('--fit');
      isSceneActiveRef.current = false;
      setIsSceneActive(false);
      return;
    }

    // Set CSS variable --fit
    const fitStr = roundedFit.toString();
    el.style.setProperty('--fit', fitStr);
    if (stickyEl) stickyEl.style.setProperty('--fit', fitStr);
    if (contentEl) contentEl.style.setProperty('--fit', fitStr);

    if (!el.classList.contains('is-scene')) {
      el.classList.add('is-scene');
    }
    el.setAttribute('data-scene-stages', stagesRef.current.toString());
    el.style.setProperty('--scene-stages', stagesRef.current.toString());

    isSceneActiveRef.current = true;
    setIsSceneActive(true);
    updateProgress();
  }, [wrapperRef, checkShouldEnable, contentSelector, updateProgress]);

  // Smoothly scroll to the matching position for a specific stage
  const scrollToStage = useCallback(
    (targetStage) => {
      const el = wrapperRef.current;
      if (!el || !el.classList.contains('is-scene')) return;

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

  // Main lifecycle: monitor viewport resize, ResizeObserver on content, and scroll
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let mediaQueryList = null;
    let resizeObserver = null;

    const contentEl = contentSelector
      ? el.querySelector(contentSelector)
      : el.querySelector('.scene-fit-content, .cream-slider-outer-card, .ocean-content-wrapper, .gameplay-cards-outer-card');
    const stickyEl = el.querySelector('.scene-sticky-inner');

    const handleResizeOrMedia = () => {
      evaluateFitAndScene();
    };

    // Initial evaluation
    evaluateFitAndScene();
    window.addEventListener('resize', handleResizeOrMedia, { passive: true });

    if (window.matchMedia) {
      mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', handleResizeOrMedia);
      }
    }

    // ResizeObserver on content element to measure natural height adjustments
    if (typeof ResizeObserver !== 'undefined' && contentEl) {
      resizeObserver = new ResizeObserver(() => {
        evaluateFitAndScene();
      });
      resizeObserver.observe(contentEl);
      if (stickyEl) {
        resizeObserver.observe(stickyEl);
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
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      observer.disconnect();
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      el.classList.remove('is-scene');
      el.style.removeProperty('--p');
      el.style.removeProperty('--scene-stages');
      el.style.removeProperty('--fit');
      el.removeAttribute('data-stage');
      el.removeAttribute('data-scene-stages');
      el.removeAttribute('data-all-normal');
      if (stickyEl) stickyEl.style.removeProperty('--fit');
      if (contentEl) contentEl.style.removeProperty('--fit');
    };
  }, [wrapperRef, contentSelector, evaluateFitAndScene, updateProgress]);

  return { isSceneActive, progress, stage, scrollToStage };
}
