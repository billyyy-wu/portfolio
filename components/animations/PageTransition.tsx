"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { triggerRouteReveal } from "@/components/animations/GlobalScrollReveal";

export interface PageTransitionProps {
  children: ReactNode;
  initialDirection?: "left" | "right";
}

const panelCount = 6;
const panelIndexes = Array.from({ length: panelCount }, (_, index) => index);
const ease = [0.22, 1, 0.36, 1] as const;
const panelCoverDuration = 0.12;
const routeCoverDurationMs = panelCount * panelCoverDuration * 1000 + 80;

function getPanelDelay(index: number) {
  return index * panelCoverDuration;
}

const panelVariants: Variants = {
  idle: {
    scaleX: 0,
  },
  cover: (index: number) => ({
    scaleX: 1,
    transition: {
      delay: getPanelDelay(index),
      duration: panelCoverDuration,
      ease,
    },
  }),
};

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
      <motion.div
        data-route-transition-overlay
        className="pointer-events-none fixed inset-0 z-40 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.14 }}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      data-route-transition-overlay
      className="pointer-events-none fixed inset-0 z-40 grid grid-cols-6 overflow-hidden bg-transparent"
      initial="idle"
      animate="cover"
      aria-hidden="true"
    >
      {panelIndexes.map((index) => (
        <motion.span
          key={index}
          custom={index}
          className="block h-full w-full origin-left bg-white"
          variants={panelVariants}
        />
      ))}
    </motion.div>
  );
}

export function PageTransition({
  children,
  initialDirection = "right",
}: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [isCovering, setIsCovering] = useState(false);
  const routeTimeoutId = useRef(0);
  const revealTimeoutId = useRef(0);
  const finishTimeoutId = useRef(0);
  const pendingHref = useRef<string | null>(null);

  void initialDirection;

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
      <motion.div
        // 跳转时保持内容本身稳定，只让实色 tile 承担过场节奏，避免半透明遮罩质感。
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease }}
      >
        {children}
      </motion.div>
      {isCovering ? (
        <TileCoverOverlay isReducedMotion={Boolean(prefersReducedMotion)} />
      ) : null}
    </div>
  );
}
