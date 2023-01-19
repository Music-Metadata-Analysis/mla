import ReactGA from "react-ga";
import { isProduction } from "@src/utilities/generics/env";
import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";
import type { AnalyticsVendorGoogleAnalyticsInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

class VendorReactGA implements AnalyticsVendorGoogleAnalyticsInterface {
  vendor: typeof ReactGA;

  constructor() {
    this.vendor = ReactGA;
  }

  event(event: AnalyticsEventDefinitionInterface): void {
    this.vendor.event(event);
  }

  initialize(analyticsID: string): void {
    this.vendor.initialize(analyticsID, {
      debug: !isProduction(),
    });
  }

  routeChange(url: string): void {
    this.vendor.set({ page: url });
    this.vendor.pageview(url);
  }
}

export default VendorReactGA;
