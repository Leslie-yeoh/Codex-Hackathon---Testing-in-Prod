import ServiceConfigService from "../config/serviceConfigService";

export class ApiClient {
  static async request(endpoint, options = {}) {
    const baseUrl = ServiceConfigService.getApiBaseUrl();

    if (!baseUrl) {
      throw new Error("API base URL is not configured.");
    }

    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    const token =
      typeof window === "undefined"
        ? ""
        : window.sessionStorage.getItem("legacyBridgeAccessToken") || "";
    const response = await fetch(baseUrl + endpoint, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.detail || "API request failed.");
    }

    return options.responseType === "blob" ? response.blob() : response.json();
  }
}

export const apiClient = (endpoint, options) =>
  ApiClient.request(endpoint, options);