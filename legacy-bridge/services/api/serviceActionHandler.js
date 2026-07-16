import ServiceConfigService from "../config/serviceConfigService";

export class ServiceActionHandler {
  static run({ apiHandler, mockHandler }) {
    if (ServiceConfigService.shouldDisplayMockActions()) {
      return mockHandler();
    }

    if (typeof apiHandler === "function") {
      return apiHandler();
    }

    return {
      ok: false,
      message:
        "API handling is selected, but no backend endpoint is connected yet.",
    };
  }
}

export default ServiceActionHandler;
