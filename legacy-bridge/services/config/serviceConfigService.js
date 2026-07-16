const trueValues = ["true", "1", "yes", "on"];

export class ServiceConfigService {
  static getEnvValue(key) {
    const values = {
      LEGACY_BRIDGE_API_BASE_URL:
        process.env.NEXT_PUBLIC_LEGACY_BRIDGE_API_BASE_URL ||
        process.env.LEGACY_BRIDGE_API_BASE_URL,
      MOCK_DISPLAY_ACTIONS:
        process.env.NEXT_PUBLIC_MOCK_DISPLAY_ACTIONS ||
        process.env.MOCK_DISPLAY_ACTIONS,
    };

    return values[key] || "";
  }

  static isEnabled(key, fallback = false) {
    const value = this.getEnvValue(key);

    if (!value) {
      return fallback;
    }

    return trueValues.includes(value.trim().toLowerCase());
  }

  static shouldDisplayMockActions() {
    return this.isEnabled("MOCK_DISPLAY_ACTIONS", true);
  }

  static getApiBaseUrl() {
    return this.getEnvValue("LEGACY_BRIDGE_API_BASE_URL");
  }
}

export default ServiceConfigService;
