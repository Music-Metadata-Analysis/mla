import { mockGoogleAnalytics } from "./vendor.mock";
import type { AnalyticsVendor } from "@src/types/clients/analytics/vendor.types";

const analyticsVendor: AnalyticsVendor = {
  GoogleAnalytics: jest.fn(() => mockGoogleAnalytics),
};

export default analyticsVendor;
