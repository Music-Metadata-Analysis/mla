import ProxyError from "../backend/proxy/proxy.error.class";
import { errorVendorBackend } from "../vendor.backend";

describe("errorVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(errorVendorBackend.ProxyError).toBe(ProxyError);
    expect(Object.keys(errorVendorBackend).length).toBe(1);
  });
});
