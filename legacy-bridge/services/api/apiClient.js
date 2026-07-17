import ServiceConfigService from "../config/serviceConfigService";

export class ApiClient {
  static async request(endpoint, options = {}) {
    const baseUrl = ServiceConfigService.getApiBaseUrl();

    if (!baseUrl) {
      throw new Error("API base URL is not configured.");
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.detail || "API request failed.");
    }

    return response.json();
  }
}

export const apiClient = (endpoint, options) =>
  ApiClient.request(endpoint, options);


