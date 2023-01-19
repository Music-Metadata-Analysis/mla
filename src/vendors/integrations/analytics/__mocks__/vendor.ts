import { MockEventDefinition, mockGoogleAnalytics } from "./vendor.mock";
import type { AnalyticsVendorInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

export const analyticsVendor: AnalyticsVendorInterface = {
  EventDefinition: jest.fn((event) => new MockEventDefinition(event)),
  GoogleAnalytics: jest.fn(() => mockGoogleAnalytics),
};
