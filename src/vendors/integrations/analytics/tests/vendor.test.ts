import VendorReactGA from "../google.analytics/react.ga.class";
import { analyticsVendor } from "../vendor";

describe("analyticsVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(analyticsVendor.GoogleAnalytics).toBe(VendorReactGA);
  });
});
