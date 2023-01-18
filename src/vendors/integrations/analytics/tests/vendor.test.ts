import { analyticsVendor } from "../vendor";
import VendorReactGA from "../web/google.analytics/react.ga.class";

describe("analyticsVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(analyticsVendor.GoogleAnalytics).toBe(VendorReactGA);
  });
});
