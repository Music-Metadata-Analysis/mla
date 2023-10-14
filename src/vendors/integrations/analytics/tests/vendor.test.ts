import { analyticsVendor } from "../vendor";
import GoogleAnalytics from "../web/client/google.analytics/react.ga.class";
import ConsentContainer from "../web/collection/consent/consent.container";
import EventDefinition from "../web/collection/event/event.class";
import useAnalyticsClient from "../web/collection/hook/analytics.hook";
import AnalyticsProvider from "../web/collection/provider/analytics.provider";

jest.mock("@src/vendors/integrations/locale/vendor");

describe("analyticsVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(analyticsVendor.collection.hook).toBe(useAnalyticsClient);
    expect(analyticsVendor.collection.Provider).toBe(AnalyticsProvider);
    expect(analyticsVendor.collection.ConsentBannerComponent).toBe(
      ConsentContainer
    );
    expect(analyticsVendor.collection.EventDefinition).toBe(EventDefinition);
    expect(analyticsVendor.ClientClass).toBe(GoogleAnalytics);
    expect(Object.keys(analyticsVendor).length).toBe(2);
    expect(Object.keys(analyticsVendor.collection).length).toBe(4);
  });
});
