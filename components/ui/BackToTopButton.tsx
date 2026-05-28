"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const scrollDeltaThreshold = 8;

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  const animationFrameId = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    function updateVisibility() {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      // 滚过四分之一屏后继续下滑即可出现，让按钮反馈更及时。
      const revealScrollY = viewportHeight / 4;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= revealScrollY || currentScrollY <= 0) {
        setIsVisible(false);
        lastScrollY.current = currentScrollY;
        animationFrameId.current = 0;
        return;
      }

      if (Math.abs(scrollDelta) > scrollDeltaThreshold) {
        // 只在超过一屏后继续向下滚动时出现；向上滚动时立即隐藏，减少遮挡。
        setIsVisible(scrollDelta > 0);
        lastScrollY.current = currentScrollY;
      }

      animationFrameId.current = 0;
    }

    function handleScroll() {
      if (animationFrameId.current) {
        return;
      }

      animationFrameId.current = window.requestAnimationFrame(updateVisibility);
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateVisibility();

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  function handleClick() {
    setIsVisible(false);
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.button
          type="button"
          aria-label="回到页面顶部"
          data-no-global-reveal
          // 固定在右下角并保持 48px 圆形尺寸，避免遮挡页面主体内容。
          className="fixed bottom-8 right-8 z-20 flex size-12 transform-gpu items-center justify-center rounded-full bg-black p-0 text-neutral-200 shadow-md shadow-black/10 transition-colors hover:text-white hover:shadow-black/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
          style={{
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.72 }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1 }
          }
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.86 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.12 }
              : {
                  opacity: { duration: 0.12, ease: "easeOut" },
                  scale: {
                    type: "spring",
                    stiffness: 420,
                    damping: 19,
                    mass: 0.55,
                  },
                }
          }
          onClick={handleClick}
        >
          <svg
            aria-hidden="true"
            className="block size-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0002 21.9998C11.7169 21.9998 11.4794 21.904 11.2877 21.7123C11.0961 21.5206 11.0002 21.2831 11.0002 20.9998V5.8248L7.10029 9.6998C6.91696 9.88314 6.68779 9.97897 6.41279 9.9873C6.13779 9.99564 5.90029 9.8998 5.70029 9.6998C5.51696 9.51647 5.42529 9.28314 5.42529 8.9998C5.42529 8.71647 5.51696 8.48314 5.70029 8.2998L11.3002 2.6998C11.4002 2.5998 11.5086 2.52897 11.6252 2.4873C11.7419 2.44564 11.8669 2.4248 12.0002 2.4248C12.1336 2.4248 12.2586 2.44564 12.3752 2.4873C12.4919 2.52897 12.6002 2.5998 12.7002 2.6998L18.3002 8.2998C18.4836 8.48314 18.5752 8.7123 18.5752 8.9873C18.5752 9.2623 18.4836 9.4998 18.3002 9.6998C18.1002 9.8998 17.8627 9.9998 17.5877 9.9998C17.3127 9.9998 17.0752 9.8998 16.8752 9.6998L13.0002 5.8248V20.9998C13.0002 21.2831 12.9044 21.5206 12.7127 21.7123C12.5211 21.904 12.2836 21.9998 12.0002 21.9998Z"
              fill="currentColor"
            />
          </svg>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
