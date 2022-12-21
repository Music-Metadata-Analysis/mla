import { mockGoogleAnalytics } from "./vendor.mock";
import type { AnalyticsVendorInterface } from "@src/types/clients/analytics/vendor.types";

const analyticsVendor: AnalyticsVendorInterface = {
  GoogleAnalytics: jest.fn(() => mockGoogleAnalytics),
};

export default analyticsVendor;
