import type { AnalyticsVendorInterface } from "@src/types/clients/analytics/vendor.types";

export const mockGoogleAnalytics = {
  event: jest.fn(),
  initialize: jest.fn(),
  routeChange: jest.fn(),
} as Record<keyof AnalyticsVendorInterface, jest.Mock>;
