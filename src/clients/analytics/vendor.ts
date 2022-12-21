import VendorReactGA from "./google.analytics/react.ga.class";
import type { AnalyticsVendorInterface } from "@src/types/clients/analytics/vendor.types";

const analyticsVendor: AnalyticsVendorInterface = {
  GoogleAnalytics: VendorReactGA,
};

export default analyticsVendor;
