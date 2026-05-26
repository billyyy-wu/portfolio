"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

export interface FadeUpProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  y?: number;
}

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.55,
  y = 28,
  ...props
}: FadeUpProps) {
  // 统一滚动揭示动效，避免页面里重复散落 Framer Motion 配置。
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
