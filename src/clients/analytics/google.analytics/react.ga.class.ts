import ReactGA from "react-ga";
import { isProduction } from "../../../utils/env";
import type EventDefinition from "../../../events/event.class";
import type { AnalyticsVendorInterface } from "../../../types/clients/analytics/vendor.types";

class VendorReactGA implements AnalyticsVendorInterface {
  vendor: typeof ReactGA;

  constructor() {
    this.vendor = ReactGA;
  }

  event(event: EventDefinition) {
    this.vendor.event(event);
  }

  initialize(analyticsID: string) {
    this.vendor.initialize(analyticsID, {
      debug: !isProduction(),
    });
  }

  routeChange(url: string) {
    this.vendor.set({ page: url });
    this.vendor.pageview(url);
  }
}

export default VendorReactGA;
