import stdoutLogger from "../endpoint.logger/stdout";
import apiLoggerVendor from "../vendor";

describe("apiLoggerVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(apiLoggerVendor.endpointLogger).toBe(stdoutLogger);
  });
});
