const links = [
  { href: "mailto:hello@example.com", label: "Email" },
  { href: "https://behance.net", label: "Behance" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer id="connect" className="site-gradient-bottom pt-24 pb-12 md:text-center">
      <div className="mx-auto w-full max-w-site px-4">
        <h2 className="mb-7 text-[24px] font-bold leading-[1.2] tracking-[-0.6px] text-ink md:hidden">
          Let&apos;s connect
        </h2>
        <ul className="flex w-full flex-col md:flex-row md:justify-center">
          {links.map((link) => (
            <li key={link.href} className="mb-7">
              <a
                className="text-xl font-medium text-neutral-600 transition hover:text-black md:px-6"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
