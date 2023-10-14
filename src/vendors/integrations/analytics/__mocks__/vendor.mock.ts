import EventDefinition from "../web/collection/event/event.class";
import { createComponent as createParentComponent } from "@fixtures/react/parent";
import { createSimpleComponent } from "@fixtures/react/simple";
import type {
  AnalyticsVendorClientInterface,
  AnalyticsVendorInterface,
} from "@src/vendors/types/integrations/analytics/vendor.types";

export const MockConsentBannerComponent = createSimpleComponent(
  "MockConsentBannerComponent"
);

export const MockEventDefinition = EventDefinition;

export const mockGoogleAnalytics = {
  event: jest.fn(),
  initialize: jest.fn(),
  routeChange: jest.fn(),
} as Record<keyof AnalyticsVendorClientInterface, jest.Mock>;

export const mockAnalyticsCollectionHook = {
  event: jest.fn(),
  setup: jest.fn(),
  trackButtonClick: jest.fn(),
  trackExternalLinkClick: jest.fn(),
  trackInternalLinkClick: jest.fn(),
};

export const MockProviderComponent = createParentComponent("AnalyticsProvider")
  .default as AnalyticsVendorInterface["collection"]["Provider"];
