import VendorReactGA from "./google.analytics/react.ga.class";
import type { AnalyticsVendor } from "../../types/clients/analytics/vendor.types";

const analyticsVendor: AnalyticsVendor = {
  GoogleAnalytics: VendorReactGA,
};

export default analyticsVendor;
