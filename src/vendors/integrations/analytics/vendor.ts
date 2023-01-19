import EventDefinition from "./web/event/event.class";
import VendorReactGA from "./web/google.analytics/react.ga.class";
import type { AnalyticsVendorInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

export const analyticsVendor: AnalyticsVendorInterface = {
  EventDefinition: EventDefinition,
  GoogleAnalytics: VendorReactGA,
};
