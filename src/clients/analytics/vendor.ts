import VendorReactGA from "./google.analytics/react.ga.class";
import type { AnalyticsVendor } from "@src/types/clients/analytics/vendor.types";

const analyticsVendor: AnalyticsVendor = {
  GoogleAnalytics: VendorReactGA,
};

export default analyticsVendor;
