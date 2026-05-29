import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FadeUpProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function FadeUp({
  children,
  className,
  ...props
}: FadeUpProps) {
  // 全局滚动动效由 GlobalScrollReveal 统一接管，这里保留为兼容旧页面结构的布局容器。
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
