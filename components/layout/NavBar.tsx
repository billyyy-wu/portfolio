"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", label: "Work" },
  { href: "#resume", label: "Resume" },
  { href: "#connect", label: "About" },
];

// 将 logo 内联为 SVG，方便在悬浮时对内部字母做轻微错位移动。
function AnimatedLogo() {
  const letterClass =
    "origin-center fill-ink transition-transform duration-300 ease-out motion-reduce:transition-none";

  return (
    <svg
      aria-hidden="true"
      className="h-[30px] w-[200px] overflow-visible"
      viewBox="0 0 200 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={`${letterClass} group-hover:-translate-y-0.5`}
        d="M31.301 12.383L24.7099 12.9958C24.1628 14.3199 22.4819 15.5934 16.9851 16.1044C10.4704 16.7101 7.67474 15.8787 7.44575 13.3536C7.2191 10.8543 9.81612 9.49557 16.3308 8.88991C21.8531 8.37652 23.7396 9.37039 24.5157 10.5714L31.1068 9.95866C30.4036 5.03522 25.499 2.73696 15.8541 3.63362C6.03119 4.54684 0.189269 7.1946 0.806143 13.9969C1.42302 20.7991 7.62011 22.0678 17.4431 21.1546C27.0624 20.2603 31.4928 17.328 31.301 12.383Z"
      />
      <path
        className={`${letterClass} delay-[20ms] group-hover:translate-y-0.5`}
        d="M48.7077 25.9732L55.6491 24.8621L42.1657 10.2549L35.1485 11.3781L26.8736 29.4679L33.8151 28.3569L34.993 25.6273L46.7051 23.7527L48.7077 25.9732ZM36.8177 21.4059L39.3913 15.519L43.6581 20.311L36.8177 21.4059Z"
      />
      <path
        className={`${letterClass} delay-[40ms] group-hover:-translate-x-0.5`}
        d="M75.548 5.9486L49.1697 2.66199L48.561 7.66975L58.5797 8.91803L57.1908 20.346L63.5318 21.1361L64.9207 9.70809L74.9394 10.9564L75.548 5.9486Z"
      />
      <path
        className={`${letterClass} delay-[60ms] group-hover:-translate-y-0.5`}
        d="M93.2851 10.557L93.9116 16.24L77.6572 18.0768L77.0308 12.3938L70.6814 13.1113L72.4955 29.5689L78.8449 28.8514L78.1958 22.9626L94.4501 21.1258L95.0992 27.0145L101.449 26.297L99.6345 9.8395L93.2851 10.557Z"
      />
      <path
        className={`${letterClass} delay-[80ms] group-hover:translate-x-0.5`}
        d="M126.612 12.3932C128.944 11.7719 130.652 10.4526 130.388 7.38513C130.022 3.13193 126.336 2.02849 121.728 2.43483L102.049 4.1702L103.468 20.6675L109.832 20.1062L109.433 15.4664L118.878 14.6335C122.952 14.2743 123.999 14.5196 124.132 16.0662L124.369 18.8243L130.734 18.2631L130.43 14.7317C130.29 13.1077 129.388 12.46 126.612 12.3932ZM109.063 11.1616L108.857 8.76435L122.172 7.59023C123.19 7.50043 124.001 7.68861 124.079 8.5908C124.163 9.57033 123.396 9.89769 122.378 9.98749L109.063 11.1616Z"
      />
      <path
        className={`${letterClass} delay-[100ms] group-hover:-translate-y-0.5`}
        d="M134.317 9.1308L131.628 25.4651L137.93 26.5287L140.619 10.1944L134.317 9.1308Z"
      />
      <path
        className={`${letterClass} delay-[120ms] group-hover:translate-y-0.5`}
        d="M164.473 0.515295L165.264 10.5485L147.66 1.87567L141.291 2.39096L142.594 18.8981L148.963 18.3828L148.187 8.55588L165.775 17.0224L172.144 16.5071L170.841 2.68246e-06L164.473 0.515295Z"
      />
      <path
        className={`${letterClass} delay-[140ms] group-hover:translate-x-0.5`}
        d="M179.392 20.193L179.625 18.1366L195.366 19.9687L195.658 17.3982L179.917 15.5661L180.151 13.5097L199.395 15.7495L199.949 10.8655L174.358 7.88693L172.49 24.3383L198.132 27.3228L198.687 22.4388L179.392 20.193Z"
      />
    </svg>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("/");
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  function closeMenu() {
    setIsOpen(false);
  }

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    setActiveHref("/");
    closeMenu();

    if (pathname === "/") {
      event.preventDefault();
      // 首页内点击 logo 时主动清除锚点并回到顶部，避免同路由点击没有反馈。
      window.history.pushState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  return (
    <header
      className={`sticky top-0 z-50 bg-white font-nav transform-gpu transition-[transform,opacity] duration-200 ease-out will-change-transform ${
        isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="mx-auto flex h-24 w-full max-w-site items-start justify-between px-4 py-8">
        <Link
          href="/"
          aria-label="Back to home"
          className="group relative block h-[30px] w-[200px]"
          onClick={handleLogoClick}
        >
          <AnimatedLogo />
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
