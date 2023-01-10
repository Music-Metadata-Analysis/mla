import type { AnalyticsVendorGoogleAnalyticsInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

export const mockGoogleAnalytics = {
  event: jest.fn(),
  initialize: jest.fn(),
  routeChange: jest.fn(),
} as Record<keyof AnalyticsVendorGoogleAnalyticsInterface, jest.Mock>;
