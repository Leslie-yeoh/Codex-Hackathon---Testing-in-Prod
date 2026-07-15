import { USER_ROLES } from "../constants";

export const ROUTES = {
  PUBLIC: ["/", "/home", "/about", "/login", "/signup", "/records/share"],
  PROTECTED: [
    "/upload",
    "/records",
    "/dashboard",
    "/logs",
    "/settings",
    "/change-password",
  ],
  ADMIN: ["/admin", "/admin/users", "/admin/settings"],
};

export const NAVIGATION_ITEMS = {
  PUBLIC: [
    { label: "Home", href: "/home" },
    { label: "About", href: "/about" },
  ],
  SIGNED_IN: [
    { label: "Home", href: "/home" },
    { label: "Upload", href: "/upload" },
    { label: "Records", href: "/records" },
    { label: "About", href: "/about" },
  ],
  ADMIN: [
    { label: "Home", href: "/home" },
    { label: "Admin Panel", href: "/admin", exact: true },
    { label: "Upload", href: "/upload" },
    { label: "Records", href: "/records" },
    { label: "About", href: "/about" },
  ],
};

export const isAdminUser = (user) => user?.role === USER_ROLES.ADMIN;

export const getNavigationItems = (user) => {
  if (isAdminUser(user)) {
    return NAVIGATION_ITEMS.ADMIN;
  }

  if (user) {
    return NAVIGATION_ITEMS.SIGNED_IN;
  }

  return NAVIGATION_ITEMS.PUBLIC;
};

export const canAccessRoute = (pathname, user) => {
  const isPublicRoute = ROUTES.PUBLIC.some((route) => pathname === route);
  const isAdminRoute = ROUTES.ADMIN.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return true;
  }

  if (isAdminRoute) {
    return isAdminUser(user);
  }

  return Boolean(user);
};
