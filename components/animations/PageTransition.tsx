"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { triggerRouteReveal } from "@/components/animations/GlobalScrollReveal";

export interface PageTransitionProps {
  children: ReactNode;
  initialDirection?: "left" | "right";
}

const panelCount = 5;
const panelIndexes = Array.from({ length: panelCount }, (_, index) => index);
const panelCoverDurations = [0.05, 0.12, 0.12, 0.12, 0.05] as const;
const panelCoverGap = 0.05;
const routeCoverDurationMs =
  (panelCoverDurations.reduce((total, duration) => total + duration, 0) +
    (panelCount - 1) * panelCoverGap) *
    1000 +
  80;

function getPanelDuration(index: number) {
  return panelCoverDurations[index] ?? panelCoverDurations[0];
}

function getPanelDelay(index: number) {
  // 每个遮罩按前面遮罩的真实时长累加，保证顺序衔接并保留固定间隔。
  return panelCoverDurations
    .slice(0, index)
    .reduce((total, duration) => total + duration + panelCoverGap, 0);
}

function getInternalHref(anchor: HTMLAnchorElement) {
  const url = new URL(anchor.href);

  if (url.origin !== window.location.origin) {
    return null;
  }

  if (anchor.target && anchor.target !== "_self") {
    return null;
  }

  const isSamePath = url.pathname === window.location.pathname;

  if (isSamePath && url.hash) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function TileCoverOverlay({ isReducedMotion }: { isReducedMotion: boolean }) {
  if (isReducedMotion) {
    return (
      <div
        data-route-transition-overlay
        className="route-transition-overlay route-transition-overlay-reduced"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      data-route-transition-overlay
      className="route-transition-overlay grid grid-cols-5"
      aria-hidden="true"
    >
      {panelIndexes.map((index) => (
        <span
          key={index}
          className="route-transition-panel"
          style={{
            "--route-panel-delay": `${getPanelDelay(index)}s`,
            "--route-panel-duration": `${getPanelDuration(index)}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function PageTransition({
  children,
  initialDirection = "right",
}: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isCovering, setIsCovering] = useState(false);
  const routeTimeoutId = useRef(0);
  const revealTimeoutId = useRef(0);
  const finishTimeoutId = useRef(0);
  const pendingHref = useRef<string | null>(null);

  void initialDirection;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncReducedMotion() {
      setPrefersReducedMotion(mediaQuery.matches);
    }

    syncReducedMotion();
    mediaQuery.addEventListener("change", syncReducedMotion);

    return () => mediaQuery.removeEventListener("change", syncReducedMotion);
  }, []);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (!anchor) {
        return;
      }

      const href = getInternalHref(anchor);

      if (!href || href === `${window.location.pathname}${window.location.search}`) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isCovering) {
        return;
      }

      pendingHref.current = href;
      // 点击后立即预取目标路由，让过场播放时并行准备下一页内容。
      router.prefetch(href);
      setIsCovering(true);

      routeTimeoutId.current = window.setTimeout(() => {
        router.push(href);
      }, prefersReducedMotion ? 180 : routeCoverDurationMs);
    }

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isCovering, prefersReducedMotion, router]);

  useLayoutEffect(() => {
    if (!isCovering || !pendingHref.current) {
      return;
    }

    const pendingUrl = new URL(pendingHref.current, window.location.origin);

    if (pendingUrl.pathname !== pathname) {
      return;
    }

    revealTimeoutId.current = window.setTimeout(() => {
      triggerRouteReveal();
    }, 40);

    finishTimeoutId.current = window.setTimeout(() => {
      pendingHref.current = null;
      setIsCovering(false);
    }, 150);
  }, [isCovering, pathname]);

  useEffect(() => {
    return () => {
      if (routeTimeoutId.current) {
        window.clearTimeout(routeTimeoutId.current);
      }

      if (revealTimeoutId.current) {
        window.clearTimeout(revealTimeoutId.current);
      }

      if (finishTimeoutId.current) {
        window.clearTimeout(finishTimeoutId.current);
      }
    };
  }, []);

  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!isCovering) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div className="relative bg-white" onClickCapture={handleClickCapture}>
      {children}
      {isCovering ? (
        <TileCoverOverlay isReducedMotion={prefersReducedMotion} />
      ) : null}
    </div>
  );
}
