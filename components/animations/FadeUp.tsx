import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface FadeUpProps extends HTMLAttributes<HTMLDivElement> {
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
  void delay;
  void duration;
  void y;

  // 全局滚动动效由 GlobalScrollReveal 统一接管，这里保留为兼容旧页面结构的布局容器。
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
