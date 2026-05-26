"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", label: "Work" },
  { href: "#resume", label: "Resume" },
  { href: "#connect", label: "About" },
];

export function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("/");
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  function closeMenu() {
    setIsOpen(false);
  }

  // 根据当前路径和锚点同步导航选中态，让下划线在选中项上保持常驻。
  useEffect(() => {
    function syncActiveHref() {
      const currentHash = window.location.hash;
      setActiveHref(currentHash || pathname || "/");
    }

    syncActiveHref();
    window.addEventListener("hashchange", syncActiveHref);

    return () => window.removeEventListener("hashchange", syncActiveHref);
  }, [pathname]);

  // 根据滚动方向控制导航显隐：下滑隐藏，上滑显示，并过滤细小滚动避免抖动。
  useEffect(() => {
    let animationFrameId = 0;

    function updateNavVisibility() {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (isOpen) {
        setIsHidden(false);
        lastScrollY.current = currentScrollY;
        animationFrameId = 0;
        return;
      }

      if (Math.abs(scrollDelta) > 8) {
        setIsHidden(scrollDelta > 0 && currentScrollY > 96);
        lastScrollY.current = currentScrollY;
      }

      animationFrameId = 0;
    }

    function handleScroll() {
      if (animationFrameId) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateNavVisibility);
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsHidden(false);
    }
  }, [isOpen]);

  return (
    <header
      className={`sticky top-0 z-20 bg-white font-nav transform-gpu transition-[transform,opacity] duration-300 ease-out will-change-transform ${
        isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="mx-auto flex h-24 w-full max-w-site items-start justify-between px-4 py-8">
        <Link
          href="/"
          aria-label="Back to home"
          className="relative block h-[30px] w-[200px]"
          onClick={() => {
            setActiveHref("/");
            closeMenu();
          }}
        >
          <Image
            src="/logo-cathrine.svg"
            alt="Cathrine"
            width={200}
            height={30}
            priority
            unoptimized
            className="h-[30px] w-[200px]"
          />
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="hidden items-start text-[20px] font-medium leading-7 tracking-[-0.5px] text-neutral-600 md:flex">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;

              return (
                <li key={item.href} className="pl-9 first:pl-0">
                  <Link
                    className={`relative inline-block pb-1 transition hover:text-ink after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-full after:-translate-x-1/2 after:scale-x-0 after:bg-ink after:transition-transform after:duration-150 after:ease-out after:content-[''] hover:after:scale-x-100 ${
                      isActive ? "text-ink after:scale-x-100" : ""
                    }`}
                    href={item.href}
                    onClick={() => setActiveHref(item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="relative flex size-8 items-center justify-center md:hidden"
            onClick={() => setIsOpen((current) => !current)}
          >
            <span className="absolute h-[5px] w-8 rounded-full bg-ink transition-transform duration-200" />
            <span
              className={`absolute h-[5px] w-8 rounded-full bg-ink transition-transform duration-200 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
        </nav>
      </div>

      <div
        id="mobile-menu"
        className={`absolute left-0 right-0 top-full bg-white px-4 pb-8 transition duration-200 md:hidden ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <ul className="mx-auto flex w-full max-w-site flex-col items-center gap-6 text-[20px] font-medium leading-[1.6] tracking-[-0.5px] text-ink">
          {navItems.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <li key={item.href}>
                <Link
                  className={`relative inline-block px-3 pb-1 after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-[calc(100%-1.5rem)] after:-translate-x-1/2 after:scale-x-0 after:bg-ink after:transition-transform after:duration-150 after:ease-out after:content-[''] hover:after:scale-x-100 ${
                    isActive ? "after:scale-x-100" : ""
                  }`}
                  href={item.href}
                  onClick={() => {
                    setActiveHref(item.href);
                    closeMenu();
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
