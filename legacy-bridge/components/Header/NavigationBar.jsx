"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { globalStyles } from "../../styles/global.style";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Upload", href: "/upload" },
  { label: "Audit Logs", href: "/logs" },
];

export default function NavigationBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderNavLink = (item, extraClassName = "") => {
    const isActive =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        onClick={() => setIsMenuOpen(false)}
        className={`${globalStyles.navLink} ${
          isActive ? "bg-teal-50 text-teal-800" : ""
        } ${extraClassName}`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className={globalStyles.header}>
      <div className={globalStyles.headerInner}>
        <div className="flex items-center justify-between gap-3 md:contents">
          <Link
            href="/"
            className={globalStyles.brand}
            aria-label="Legacy Bridge dashboard"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={globalStyles.brandMark}>LB</span>
            <span className="flex flex-col leading-tight">
              <span>Legacy Bridge</span>
              <span className="text-xs font-medium text-slate-500">
                Clinical data interoperability
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 md:hidden"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="sr-only">
              {isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            </span>
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span
                className={`h-0.5 rounded bg-current transition ${
                  isMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 rounded bg-current transition ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 rounded bg-current transition ${
                  isMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        <div className="hidden gap-3 md:flex md:flex-row md:items-center">
          <nav className={globalStyles.nav} aria-label="Primary navigation">
            {navItems.map((item) => renderNavLink(item))}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`${globalStyles.badge} bg-emerald-100 text-emerald-800`}>
              Session secured
            </span>
            <div className={globalStyles.profileBadge}>
              <span className="block text-xs font-medium text-slate-500">
                Clinical Reviewer
              </span>
              <span>Dr. Sarah Tan</span>
            </div>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={`${isMenuOpen ? "flex" : "hidden"} flex-col gap-3 border-t border-slate-200 pt-3 md:hidden`}
        >
          <nav className="flex flex-col gap-1 text-sm font-medium text-slate-700" aria-label="Mobile navigation">
            {navItems.map((item) => renderNavLink(item, "w-full"))}
          </nav>

          <div className="flex flex-col gap-2 rounded-lg bg-slate-50 p-3">
            <span className={`${globalStyles.badge} w-fit bg-emerald-100 text-emerald-800`}>
              Session secured
            </span>
            <div className="text-sm font-medium text-slate-700">
              <span className="block text-xs font-medium text-slate-500">
                Clinical Reviewer
              </span>
              <span>Dr. Sarah Tan</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
