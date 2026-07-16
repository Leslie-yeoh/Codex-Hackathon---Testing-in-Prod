import ServiceConfigService from "../config/serviceConfigService";

export class ApiClient {
  static async request(endpoint, options = {}) {
    const baseUrl = ServiceConfigService.getApiBaseUrl();

    if (!baseUrl) {
      throw new Error("API base URL is not configured.");
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error("API request failed.");
    }

    return response.json();
  }
}

export const apiClient = (endpoint, options) =>
  ApiClient.request(endpoint, options);
