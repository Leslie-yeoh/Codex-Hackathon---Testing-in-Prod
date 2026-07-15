import { USER_ROLES } from "../../constants";
import {
  normalizeEmail,
  normalizeUsername,
  securitySanitizer,
} from "../../utils/globalFormatter";

const registeredUsersKey = "legacyBridgeRegisteredUsers";
const rememberedEmailKey = "legacyBridgeRememberedEmail";
const currentUserKey = "legacyBridgeCurrentUser";
const frontendMockUsers = [
  {
    username: "Admin User",
    email: "admin@legacybridge.local",
    password: "Admin@1234",
    role: USER_ROLES.ADMIN,
  },
  {
    username: "Clinical User",
    email: "user@legacybridge.local",
    password: "User@1234",
    role: USER_ROLES.USER,
  },
];

const normalizeRole = (role) =>
  role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.USER;

const readUsers = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(registeredUsersKey)) || [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  window.localStorage.setItem(registeredUsersKey, JSON.stringify(users));
};

export const registerUser = ({ username, email, password }) => {
  const safeUser = {
    username: normalizeUsername(username),
    email: normalizeEmail(email),
    password: securitySanitizer(password, 128),
  };
  const users = readUsers();
  const existingUser = users.find((user) => user.email === safeUser.email);

  if (existingUser) {
    return {
      ok: false,
      message: "An account already exists for this email.",
    };
  }

  writeUsers([
    ...users,
    {
      username: safeUser.username,
      email: safeUser.email,
      password: safeUser.password,
      role: USER_ROLES.USER,
      status: "Active",
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  return {
    ok: true,
    message: "Account registered. Please log in with your credentials.",
  };
};

export const authenticateUser = ({ email, password }) => {
  const safeCredentials = {
    email: normalizeEmail(email),
    password: securitySanitizer(password, 128),
  };

  const mockUser = frontendMockUsers.find(
    (user) =>
      user.email === safeCredentials.email &&
      user.password === safeCredentials.password
  );

  if (mockUser) {
    window.sessionStorage.setItem(
      currentUserKey,
      JSON.stringify({
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        mustChangePassword: false,
      })
    );

    return {
      ok: true,
      user: mockUser,
    };
  }

  const users = readUsers();
  const user = users.find((item) => item.email === safeCredentials.email);

  if (!user || user.password !== safeCredentials.password) {
    return {
      ok: false,
      message: "Email or password is incorrect.",
    };
  }

  if (user.status === "Inactive") {
    return {
      ok: false,
      message: "This account is inactive. Contact an administrator.",
    };
  }

  window.sessionStorage.setItem(
    currentUserKey,
    JSON.stringify({
      username: user.username,
      email: user.email,
      role: normalizeRole(user.role),
      mustChangePassword: Boolean(user.mustChangePassword),
    })
  );

  return {
    ok: true,
    user,
  };
};

export const getUsers = () => [
  ...frontendMockUsers.map((user) => ({
    username: user.username,
    email: user.email,
    role: user.role,
    status: "Active",
    mustChangePassword: false,
    isSystemUser: true,
  })),
  ...readUsers().map((user) => ({
    ...user,
    status: user.status || "Active",
    role: normalizeRole(user.role),
    mustChangePassword: Boolean(user.mustChangePassword),
    isSystemUser: false,
  })),
];

export const createUserByAdmin = ({ username, email, password, role }) => {
  const safeUser = {
    username: normalizeUsername(username),
    email: normalizeEmail(email),
    password: securitySanitizer(password, 128),
    role: normalizeRole(role),
  };
  const users = readUsers();
  const existingUser = getUsers().find((user) => user.email === safeUser.email);

  if (existingUser) {
    return {
      ok: false,
      message: "A user already exists for this email.",
    };
  }

  writeUsers([
    ...users,
    {
      username: safeUser.username,
      email: safeUser.email,
      password: safeUser.password,
      role: safeUser.role,
      status: "Active",
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  return {
    ok: true,
    message: "User created with temporary password.",
  };
};

export const updateUserStatus = (email, status) => {
  const safeEmail = normalizeEmail(email);

  writeUsers(
    readUsers().map((user) =>
      user.email === safeEmail
        ? {
            ...user,
            status,
          }
        : user
    )
  );
};

export const updateCurrentUserPassword = (password) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return {
      ok: false,
      message: "Sign in before changing password.",
    };
  }

  const safePassword = securitySanitizer(password, 128);
  let updatedUser = null;

  writeUsers(
    readUsers().map((user) => {
      if (user.email !== currentUser.email) {
        return user;
      }

      updatedUser = {
        ...user,
        password: safePassword,
        mustChangePassword: false,
        status: user.status || "Active",
      };

      return updatedUser;
    })
  );

  if (!updatedUser) {
    return {
      ok: false,
      message: "Unable to update this account.",
    };
  }

  window.sessionStorage.setItem(
    currentUserKey,
    JSON.stringify({
      username: updatedUser.username,
      email: updatedUser.email,
      role: normalizeRole(updatedUser.role),
      mustChangePassword: false,
    })
  );

  return {
    ok: true,
    message: "Password updated.",
  };
};

export const getCurrentUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(window.sessionStorage.getItem(currentUserKey));
  } catch {
    return null;
  }
};

export const signOutUser = () => {
  window.sessionStorage.removeItem(currentUserKey);
};

export const getRememberedEmail = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(rememberedEmailKey) || "";
};

export const saveRememberedEmail = (email) => {
  window.localStorage.setItem(rememberedEmailKey, normalizeEmail(email));
};

export const clearRememberedEmail = () => {
  window.localStorage.removeItem(rememberedEmailKey);
};
