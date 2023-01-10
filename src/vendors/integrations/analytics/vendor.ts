import VendorReactGA from "./google.analytics/react.ga.class";
import type { AnalyticsVendorInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

export const analyticsVendor: AnalyticsVendorInterface = {
  GoogleAnalytics: VendorReactGA,
};
