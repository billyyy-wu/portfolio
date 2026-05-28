"use client";

import { useEffect } from "react";

type RevealType = "text" | "image" | "work-card";

interface RevealTarget {
  element: HTMLElement;
  type: RevealType;
}

const textSelector = [
  "main h1",
  "main h2",
  "main h3",
  "main h4",
  "main h5",
  "main h6",
  "main p",
  "main li",
  "main blockquote",
  "main figcaption",
  "footer h1",
  "footer h2",
  "footer h3",
  "footer h4",
  "footer h5",
  "footer h6",
  "footer p",
  "footer li",
  "footer blockquote",
  "footer figcaption",
].join(",");

const imageSelector = "main img, footer img";
const groupedRevealSelector = '[data-global-reveal-group="work-card"]';
const visibleClassName = "is-visible";
const instantClassName = "is-instant";
const revealRootMargin = "0px 0px -4% 0px";
const revealThreshold = 0.16;
const scrollDirectionDelta = 2;
let cleanupActiveReveal: () => void = () => undefined;

function shouldReveal(element: HTMLElement) {
  if (element.closest("[data-no-global-reveal]")) {
    return false;
  }

  const revealGroup = element.closest<HTMLElement>("[data-global-reveal-group]");

  return !revealGroup || revealGroup === element;
}

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return rect.top < window.innerHeight && rect.bottom > 0;
}

function collectRevealTargets(): RevealTarget[] {
  const groupedTargets = Array.from(
    document.querySelectorAll<HTMLElement>(groupedRevealSelector),
  )
    .filter(shouldReveal)
    .map((element) => ({ element, type: "work-card" as const }));
  const textTargets = Array.from(document.querySelectorAll<HTMLElement>(textSelector))
    .filter(shouldReveal)
    .map((element) => ({ element, type: "text" as const }));
  const imageTargets = Array.from(document.querySelectorAll<HTMLElement>(imageSelector))
    .filter(shouldReveal)
    .map((element) => ({ element, type: "image" as const }));

  return [...groupedTargets, ...textTargets, ...imageTargets];
}

function showTarget(element: HTMLElement, revealMode: "animated" | "instant") {
  if (revealMode === "instant") {
    element.classList.add(instantClassName);
  } else {
    element.classList.remove(instantClassName);
  }

  element.classList.add(visibleClassName);
}

function setupReveal(animateInitialViewport: boolean) {
  if (!("IntersectionObserver" in window)) {
    collectRevealTargets().forEach(({ element, type }) => {
      element.dataset.globalReveal = type;
      showTarget(element, "instant");
    });

    return () => undefined;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const targets = collectRevealTargets();
  let animationFrameId = 0;

  if (prefersReducedMotion) {
    targets.forEach(({ element, type }) => {
      element.dataset.globalReveal = type;
      showTarget(element, "instant");
    });

    return () => undefined;
  }

  let latestScrollY = window.scrollY;
  let hasScrolledDown = latestScrollY > 0;
  let scrollDirection: "up" | "down" = "down";
  const initialViewportTargets: HTMLElement[] = [];
  const initialViewportTargetSet = new Set<HTMLElement>();

  function updateScrollDirection() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - latestScrollY;

    if (Math.abs(delta) > scrollDirectionDelta) {
      scrollDirection = delta > 0 ? "down" : "up";
      hasScrolledDown = hasScrolledDown || delta > 0;
      latestScrollY = currentScrollY;
    }
  }

  // 首屏默认直接显示；路由切换进入的新页面会重新执行一遍首屏元素 reveal。
  targets.forEach(({ element, type }) => {
    element.dataset.globalReveal = type;

    if (isInViewport(element)) {
      if (animateInitialViewport) {
        element.classList.remove(visibleClassName, instantClassName);
        initialViewportTargets.push(element);
        initialViewportTargetSet.add(element);
        return;
      }

      showTarget(element, "instant");
      return;
    }

    element.classList.remove(visibleClassName, instantClassName);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const target = entry.target as HTMLElement;
        const revealMode =
          hasScrolledDown && scrollDirection === "down" ? "animated" : "instant";

        showTarget(target, revealMode);
        observer.unobserve(target);
      });
    },
    {
      rootMargin: revealRootMargin,
      threshold: revealThreshold,
    },
  );

  targets.forEach(({ element }) => {
    if (
      !element.classList.contains(visibleClassName) &&
      !initialViewportTargetSet.has(element)
    ) {
      observer.observe(element);
    }
  });

  if (initialViewportTargets.length > 0) {
    animationFrameId = window.requestAnimationFrame(() => {
      initialViewportTargets.forEach((element) => {
        showTarget(element, "animated");
        observer.unobserve(element);
      });
    });
  }

  window.addEventListener("scroll", updateScrollDirection, { passive: true });

  return () => {
    window.removeEventListener("scroll", updateScrollDirection);
    observer.disconnect();

    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }
  };
}

export function triggerRouteReveal() {
  cleanupActiveReveal();
  cleanupActiveReveal = setupReveal(true);
}

export function GlobalScrollReveal() {
  useEffect(() => {
    cleanupActiveReveal = setupReveal(false);
    return () => {
      cleanupActiveReveal();
      cleanupActiveReveal = () => undefined;
    };
  }, []);

  return null;
}
