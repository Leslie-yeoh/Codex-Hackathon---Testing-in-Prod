"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { globalStyles } from "../../styles/global.style";

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Upload", href: "/upload" },
  { label: "Audit Logs", href: "/logs" },
  { label: "About", href: "/about" },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function NavigationBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const renderNavLink = (item, extraClassName = "") => {
    const isActive =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        onClick={() => {
          setIsMenuOpen(false);
          setIsProfileOpen(false);
        }}
        className={cn(
          globalStyles.navLink,
          isActive && styles.navLinkActive,
          extraClassName
        )}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className={globalStyles.header}>
      <div className={cn(globalStyles.headerInner, styles.headerInner)}>
        <div className={styles.mobileHeaderRow}>
          <Link
            href="/home"
            className={globalStyles.brand}
            aria-label="Legacy Bridge home"
            onClick={() => {
              setIsMenuOpen(false);
              setIsProfileOpen(false);
            }}
          >
            <span className={globalStyles.brandMark}>LB</span>
            <span className={styles.brandText}>
              <span>Legacy Bridge</span>
              <span className={styles.brandSubtitle}>
                Clinical data interoperability
              </span>
            </span>
          </Link>

          <button
            type="button"
            className={styles.menuButton}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setIsMenuOpen((current) => !current);
              setIsProfileOpen(false);
            }}
          >
            <span className={styles.screenReaderOnly}>
              {isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            </span>
            <span className={styles.hamburgerIcon} aria-hidden="true">
              <span
                className={cn(
                  styles.hamburgerLine,
                  isMenuOpen && styles.hamburgerLineTopOpen
                )}
              />
              <span
                className={cn(
                  styles.hamburgerLine,
                  isMenuOpen && styles.hamburgerLineMiddleOpen
                )}
              />
              <span
                className={cn(
                  styles.hamburgerLine,
                  isMenuOpen && styles.hamburgerLineBottomOpen
                )}
              />
            </span>
          </button>
        </div>

        <div className={styles.desktopNavWrap}>
          <nav className={globalStyles.nav} aria-label="Primary navigation">
            {navItems.map((item) => renderNavLink(item))}
          </nav>

          <div className={styles.profileWrap}>
            <button
              type="button"
              className={cn(globalStyles.profileBadge, styles.profileButton)}
              aria-label="Open personalisation menu"
              aria-expanded={isProfileOpen}
              aria-controls="profile-menu"
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <span className={styles.profileAvatar}>ST</span>
              <span className={styles.profileCopy}>
                <span className={styles.profileRole}>Clinical Reviewer</span>
                <span>Dr. Sarah Tan</span>
              </span>
              <span className={styles.chevron} aria-hidden="true">
                {isProfileOpen ? "▲" : "▼"}
              </span>
            </button>

            <div
              id="profile-menu"
              className={cn(
                styles.profileMenu,
                isProfileOpen ? styles.profileMenuOpen : styles.profileMenuClosed
              )}
            >
              <div className={styles.profileMenuHeader}>
                <p className={styles.profileMenuName}>Dr. Sarah Tan</p>
                <p className={styles.profileMenuMeta}>Clinical Reviewer</p>
                <span className={cn(globalStyles.badge, styles.securedBadge)}>
                  Session secured
                </span>
              </div>

              <button type="button" className={styles.profileMenuItem}>
                Personalisation
              </button>
              <button type="button" className={styles.profileMenuItem}>
                Notification preferences
              </button>
              <button type="button" className={styles.profileMenuItem}>
                Accessibility settings
              </button>
              <Link href="/login" className={styles.profileMenuLink}>
                Switch account
              </Link>
            </div>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={cn(
            isMenuOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed,
            styles.mobileMenu
          )}
        >
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {navItems.map((item) => renderNavLink(item, styles.mobileNavLink))}
          </nav>

          <div className={styles.mobileProfilePanel}>
            <div className={styles.mobileProfileHeader}>
              <span className={styles.profileAvatar}>ST</span>
              <div className={styles.mobileProfileText}>
                <span className={styles.profileRole}>Clinical Reviewer</span>
                <span>Dr. Sarah Tan</span>
              </div>
            </div>
            <span className={cn(globalStyles.badge, styles.mobileSecuredBadge)}>
              Session secured
            </span>
            <div className={styles.mobileProfileActions}>
              <button type="button" className={styles.profileMenuItem}>
                Personalisation
              </button>
              <button type="button" className={styles.profileMenuItem}>
                Accessibility settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  // Navigation links
  navLinkActive: "bg-teal-50 text-teal-800",

  // Brand
  headerInner: "relative",
  mobileHeaderRow: "flex items-center justify-between gap-3 md:contents",
  brandText: "flex flex-col leading-tight",
  brandSubtitle: "text-xs font-medium text-slate-500",

  // Mobile hamburger button
  menuButton: [
    "inline-flex h-10 w-10 items-center justify-center",
    "rounded-md border border-slate-200 bg-white text-slate-700",
    "transition hover:bg-slate-50",
    "focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2",
    "md:hidden",
  ].join(" "),
  screenReaderOnly: "sr-only",
  hamburgerIcon: "flex w-5 flex-col gap-1.5",
  hamburgerLine: "h-0.5 rounded bg-current transition",
  hamburgerLineTopOpen: "translate-y-2 rotate-45",
  hamburgerLineMiddleOpen: "opacity-0",
  hamburgerLineBottomOpen: "-translate-y-2 -rotate-45",

  // Desktop layout
  desktopNavWrap: "hidden gap-3 md:flex md:flex-row md:items-center",

  // Profile
  profileWrap: "relative flex flex-wrap items-center gap-2",
  profileButton: "flex items-center gap-2 text-left transition hover:bg-white",
  profileAvatar: "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-bold text-white",
  profileCopy: "flex flex-col",
  securedBadge: "bg-emerald-100 text-emerald-800",
  profileRole: "block text-xs font-medium text-slate-500",
  chevron: "text-xs text-slate-400",
  profileMenu: [
    "absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden",
    "rounded-lg border border-slate-200 bg-white shadow-lg",
  ].join(" "),
  profileMenuOpen: "block",
  profileMenuClosed: "hidden",
  profileMenuHeader: "flex flex-col gap-1 border-b border-slate-200 p-4",
  profileMenuName: "text-sm font-semibold text-slate-950",
  profileMenuMeta: "text-xs font-medium text-slate-500",
  profileMenuItem: "w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100",
  profileMenuLink: "block rounded-md px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50",

  // Mobile menu
  mobileMenu: [
    "absolute left-4 right-4 top-full z-30",
    "mt-2 flex-col gap-3 rounded-lg border border-slate-200",
    "bg-white p-3 shadow-lg md:hidden",
    "sm:left-6 sm:right-6",
  ].join(" "),
  mobileMenuOpen: "flex",
  mobileMenuClosed: "hidden",
  mobileNav: "flex flex-col gap-1 text-sm font-medium text-slate-700",
  mobileNavLink: "w-full",
  mobileProfilePanel: "flex flex-col gap-3 rounded-lg bg-slate-50 p-3",
  mobileProfileHeader: "flex items-center gap-2",
  mobileSecuredBadge: "w-fit bg-emerald-100 text-emerald-800",
  mobileProfileText: "text-sm font-medium text-slate-700",
  mobileProfileActions: "grid gap-1",
};
