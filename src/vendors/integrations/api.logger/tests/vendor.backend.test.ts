import stdoutLogger from "../backend/endpoint.logger/stdout";
import { apiLoggerVendorBackend } from "../vendor.backend";

describe("apiLoggerVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(apiLoggerVendorBackend.endpointLogger).toBe(stdoutLogger);
  });
});
