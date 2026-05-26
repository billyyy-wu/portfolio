"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface PageTransitionProps {
  children: ReactNode;
  initialDirection?: "left" | "right";
}

const directionOffset = {
  left: -24,
  right: 24,
} as const;

export function PageTransition({
  children,
  initialDirection = "right",
}: PageTransitionProps) {
  const pathname = usePathname();
  const x = directionOffset[initialDirection];

  // 使用 pathname 作为 key，确保 App Router 页面切换时触发出入场动画。
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -x }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
