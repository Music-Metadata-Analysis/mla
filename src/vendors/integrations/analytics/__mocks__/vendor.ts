import { mockGoogleAnalytics } from "./vendor.mock";
import type { AnalyticsVendorInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

export const analyticsVendor: AnalyticsVendorInterface = {
  GoogleAnalytics: jest.fn(() => mockGoogleAnalytics),
};
