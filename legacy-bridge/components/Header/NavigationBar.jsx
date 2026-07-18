"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/globalHooks";
import { getNavigationItems } from "../../navigation/routes";
import { globalStyles } from "../../styles/global.style";
import ConfirmationModal from "../Modal/ConfirmationModal";
import { showToastAfterReload } from "../Toast/ToastProvider";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function NavigationBar() {
  const pathname = usePathname();
  const [clientPathname, setClientPathname] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const { isSignedIn, signOut, user } = useAuth();

  useEffect(() => {
    setIsClient(true);
    setClientPathname(pathname || "");
  }, [pathname]);

  const sessionUser = isClient ? user : null;
  const navItems = getNavigationItems(sessionUser);
  const displayName = sessionUser?.username || "User";
  const displayRole = sessionUser?.role || "User";
  const displayInitials = getInitials(displayName);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    showToastAfterReload("Successfully signed out.", "error");
    closeMenus();
    setIsSignOutModalOpen(false);
    window.location.assign("/home");
  };

  const requestSignOut = () => {
    closeMenus();
    setIsSignOutModalOpen(true);
  };

  const renderNavLink = (item, extraClassName = "") => {
    const isActive = item.exact
      ? clientPathname === item.href
      : item.href === "/"
        ? clientPathname === "/"
        : clientPathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        onClick={closeMenus}
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
    <>
    <header className={globalStyles.header}>
      <div className={cn(globalStyles.headerInner, styles.headerInner)}>
        <div className={styles.mobileHeaderRow}>
          <Link
            href="/home"
            className={globalStyles.brand}
            aria-label="Legacy Bridge home"
            onClick={closeMenus}
          >
            <span className={styles.brandLogoMark}>
              <Image
                src="/logo/webp/legacy-bridge_no_title.webp"
                alt=""
                width={48}
                height={48}
                className={styles.brandLogoImage}
              />
            </span>
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
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
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

          {isClient && isSignedIn ? (
            <div className={styles.profileWrap}>
              <button
                type="button"
                className={cn(globalStyles.profileBadge, styles.profileButton)}
                aria-label="Open personal settings"
                aria-expanded={isProfileOpen}
                aria-controls="profile-menu"
                onClick={() => setIsProfileOpen((current) => !current)}
              >
                <span className={styles.profileAvatar}>{displayInitials}</span>
                <span className={styles.profileCopy}>
                  <span className={styles.profileRole}>{displayRole}</span>
                  <span>{displayName}</span>
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
                <Link
                  href="/settings"
                  className={styles.profileMenuLink}
                  onClick={closeMenus}
                >
                  Settings
                </Link>
                <button
                  type="button"
                  className={styles.profileMenuDanger}
                  onClick={requestSignOut}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className={styles.signInLink}>
              Sign in
            </Link>
          )}
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

          {isClient && isSignedIn ? (
            <div className={styles.mobileProfilePanel}>
              <div className={styles.mobileProfileHeader}>
                <span className={styles.profileAvatar}>{displayInitials}</span>
                <span className={styles.mobileProfileCopy}>
                  <span className={styles.profileRole}>{displayRole}</span>
                  <span>{displayName}</span>
                </span>
              </div>
              <Link
                href="/settings"
                className={styles.profileMenuLink}
                onClick={closeMenus}
              >
                Settings
              </Link>
              <button
                type="button"
                className={styles.profileMenuDanger}
                onClick={requestSignOut}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.mobileSignInLink}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
    <ConfirmationModal
      cancelLabel="Stay signed in"
      confirmLabel="Sign out"
      description="You will return to the home page and need to sign in again to access upload, records, and settings."
      isOpen={isSignOutModalOpen}
      onCancel={() => setIsSignOutModalOpen(false)}
      onConfirm={handleSignOut}
      title="Sign out?"
    />
    </>
  );
}

const styles = {
  navLinkActive: "bg-teal-50 text-teal-800",
  headerInner: "relative",
  mobileHeaderRow: "flex items-center justify-between gap-3 lg:contents",
  brandLogoMark:
    "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white",
  brandLogoImage: "h-full w-full object-contain",
  brandText: "flex flex-col leading-tight",
  brandSubtitle: "text-xs font-medium text-slate-500",
  menuButton: [
    "inline-flex h-10 w-10 items-center justify-center",
    "rounded-md border border-slate-200 bg-white text-slate-700",
    "transition hover:bg-slate-50",
    "focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2",
    "lg:hidden",
  ].join(" "),
  screenReaderOnly: "sr-only",
  hamburgerIcon: "flex w-5 flex-col gap-1.5",
  hamburgerLine: "h-0.5 rounded bg-current transition",
  hamburgerLineTopOpen: "translate-y-2 rotate-45",
  hamburgerLineMiddleOpen: "opacity-0",
  hamburgerLineBottomOpen: "-translate-y-2 -rotate-45",
  desktopNavWrap: "hidden gap-3 lg:flex lg:flex-row lg:items-center",
  profileWrap: "relative flex flex-wrap items-center gap-2",
  profileButton: "flex items-center gap-2 text-left transition hover:bg-white",
  profileAvatar:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-bold text-white",
  profileCopy: "flex flex-col",
  profileRole: "block text-xs font-medium text-slate-500",
  chevron: "text-xs text-slate-400",
  profileMenu: [
    "absolute right-0 top-full z-40 mt-2 w-40",
    "rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
  ].join(" "),
  profileMenuOpen: "block",
  profileMenuClosed: "hidden",
  profileMenuLink:
    "block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
  profileMenuDanger:
    "w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50",
  signInLink:
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50",
  mobileMenu: [
    "absolute left-4 right-4 top-full z-30",
    "mt-2 flex-col gap-3 rounded-lg border border-slate-200",
    "bg-white p-3 shadow-lg lg:hidden",
    "sm:left-6 sm:right-6",
  ].join(" "),
  mobileMenuOpen: "flex",
  mobileMenuClosed: "hidden",
  mobileNav: "flex flex-col gap-1 text-sm font-medium text-slate-700",
  mobileNavLink: "w-full",
  mobileProfilePanel: "grid gap-2 rounded-lg bg-slate-50 p-2",
  mobileProfileHeader: "flex items-center gap-2 border-b border-slate-200 pb-2",
  mobileProfileCopy: "flex min-w-0 flex-col text-sm font-semibold text-slate-800",
  mobileSignInLink:
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50",
};




