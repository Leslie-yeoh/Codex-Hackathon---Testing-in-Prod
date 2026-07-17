import { USER_ROLES } from "../../constants";
import {
  normalizeEmail,
  normalizeUsername,
  securitySanitizer,
} from "../../utils/globalFormatter";
import ServiceConfigService from "../config/serviceConfigService";
import NormalizationService from "../normalization/normalizationService";
import { apiClient } from "../api/apiClient";

const USE_MOCK = ServiceConfigService.shouldDisplayMockActions();


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

const getApiNotConnectedResponse = (action, payload) => ({
  ok: false,
  action,
  payload,
  message:
    "Backend API is not connected yet. Enable mock display actions to use frontend data.",
});

const normalizeUser = (user) => ({
  ...user,
  username: user?.username ?? user?.display_name ?? "",
  email: normalizeEmail(user?.email || ""),
  role: normalizeRole(user?.role),
  status: user?.status || "Active",
  mustChangePassword: Boolean(user?.mustChangePassword ?? user?.must_change_password),
});

class LoginService {
  static registerUser({ username, email, password }) {
    if (!ServiceConfigService.shouldDisplayMockActions()) {
      return apiClient("/auth/signup", { method: "POST", body: JSON.stringify({ username, email, password, confirm_password: password }) }).then((user) => ({ ok: true, user: normalizeUser(user) })).catch((error) => ({ ok: false, message: error.message }));
    }
    const apiPayload = NormalizationService.userToBackend({
      username,
      email,
      password,
    });

    if (!USE_MOCK) {
      return getApiNotConnectedResponse("registerUser", apiPayload);
    }

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
  }

  static authenticateUser({ email, password }) {
    if (!ServiceConfigService.shouldDisplayMockActions()) {
      return apiClient("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }).then(async (token) => {
        window.sessionStorage.setItem("legacyBridgeAccessToken", token.access_token);
        const user = await apiClient("/auth/me", { headers: { Authorization: `Bearer ${token.access_token}` } });
        const normalizedUser = normalizeUser(user);
        this.writeCurrentUser(normalizedUser);
        return { ok: true, user: normalizedUser };
      }).catch((error) => ({ ok: false, message: error.message }));
    }
    const apiPayload = NormalizationService.userToBackend({ email, password });

    if (!USE_MOCK) {
      return getApiNotConnectedResponse("authenticateUser", apiPayload);
    }

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
      this.writeCurrentUser({
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        mustChangePassword: false,
      });

      return {
        ok: true,
        user: normalizeUser(mockUser),
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

    const normalizedUser = normalizeUser(user);
    this.writeCurrentUser(normalizedUser);

    return {
      ok: true,
      user: normalizedUser,
    };
  }

  static getUsers() {
    return [
      ...frontendMockUsers.map((user) => ({
        ...normalizeUser(user),
        isSystemUser: true,
      })),
      ...readUsers().map((user) => ({
        ...normalizeUser(user),
        isSystemUser: false,
      })),
    ];
  }

  static createUserByAdmin({ username, email, password, role }) {
    const apiPayload = NormalizationService.userToBackend({
      username,
      email,
      password,
      role,
    });

    if (!USE_MOCK) {
      return getApiNotConnectedResponse("createUserByAdmin", apiPayload);
    }

    const safeUser = {
      username: normalizeUsername(username),
      email: normalizeEmail(email),
      password: securitySanitizer(password, 128),
      role: normalizeRole(role),
    };
    const users = readUsers();
    const existingUser = this.getUsers().find(
      (user) => user.email === safeUser.email
    );

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
  }

  static updateUserStatus(email, status) {
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
  }

  static updateCurrentUserPassword(password) {
    const apiPayload = NormalizationService.userToBackend({ password });

    if (!USE_MOCK) {
      return getApiNotConnectedResponse("updateCurrentUserPassword", apiPayload);
    }

    const currentUser = this.getCurrentUser();

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

        updatedUser = normalizeUser({
          ...user,
          password: safePassword,
          mustChangePassword: false,
          status: user.status || "Active",
        });

        return updatedUser;
      })
    );

    if (!updatedUser) {
      return {
        ok: false,
        message: "Unable to update this account.",
      };
    }

    this.writeCurrentUser(updatedUser);

    return {
      ok: true,
      message: "Password updated.",
    };
  }

  static getCurrentUser() {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return JSON.parse(window.sessionStorage.getItem(currentUserKey));
    } catch {
      return null;
    }
  }

  static writeCurrentUser(user) {
    window.sessionStorage.setItem(
      currentUserKey,
      JSON.stringify({
        username: user.username,
        email: user.email,
        role: normalizeRole(user.role),
        mustChangePassword: Boolean(user.mustChangePassword),
      })
    );
  }

  static signOutUser() {
    window.sessionStorage.removeItem(currentUserKey);
  }

  static getRememberedEmail() {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem(rememberedEmailKey) || "";
  }

  static saveRememberedEmail(email) {
    window.localStorage.setItem(rememberedEmailKey, normalizeEmail(email));
  }

  static clearRememberedEmail() {
    window.localStorage.removeItem(rememberedEmailKey);
  }
}

export const registerUser = (payload) => LoginService.registerUser(payload);
export const authenticateUser = (payload) => LoginService.authenticateUser(payload);
export const getUsers = () => LoginService.getUsers();
export const createUserByAdmin = (payload) =>
  LoginService.createUserByAdmin(payload);
export const updateUserStatus = (email, status) =>
  LoginService.updateUserStatus(email, status);
export const updateCurrentUserPassword = (password) =>
  LoginService.updateCurrentUserPassword(password);
export const getCurrentUser = () => LoginService.getCurrentUser();
export const signOutUser = () => LoginService.signOutUser();
export const getRememberedEmail = () => LoginService.getRememberedEmail();
export const saveRememberedEmail = (email) =>
  LoginService.saveRememberedEmail(email);
export const clearRememberedEmail = () => LoginService.clearRememberedEmail();

export default LoginService;



