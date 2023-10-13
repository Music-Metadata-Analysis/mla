import { analyticsVendor } from "../vendor";
import EventDefinition from "../web/event/event.class";
import VendorReactGA from "../web/google.analytics/react.ga.class";

describe("analyticsVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(analyticsVendor.EventDefinition).toBe(EventDefinition);
    expect(analyticsVendor.GoogleAnalytics).toBe(VendorReactGA);
    expect(Object.keys(analyticsVendor).length).toBe(2);
  });
});
