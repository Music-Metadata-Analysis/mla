import ReactGA from "react-ga4";
import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";
import type { AnalyticsVendorClientInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

class GoogleAnalytics implements AnalyticsVendorClientInterface {
  vendor: typeof ReactGA;

  constructor() {
    this.vendor = ReactGA;
  }

  event(event: AnalyticsEventDefinitionInterface): void {
    this.vendor.event(event);
  }

  initialize(analyticsID: string): void {
    this.vendor.initialize(analyticsID, {
      testMode: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  routeChange(_: string): void {
    // Deprecated in GA4
  }
}

export default GoogleAnalytics;
