import {
  MockConsentBannerComponent,
  MockEventDefinition,
  mockGoogleAnalytics,
  mockAnalyticsCollectionHook,
  MockProviderComponent,
} from "./vendor.mock";
import type { AnalyticsVendorInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

export const analyticsVendor: AnalyticsVendorInterface = {
  ClientClass: jest.fn(() => mockGoogleAnalytics),
  collection: {
    ConsentBannerComponent: MockConsentBannerComponent,
    EventDefinition: jest.fn((event) => new MockEventDefinition(event)),
    hook: jest.fn(() => mockAnalyticsCollectionHook),
    Provider: MockProviderComponent,
  },
};
