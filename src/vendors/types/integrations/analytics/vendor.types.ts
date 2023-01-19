import type { AnalyticsEventDefinitionConstructorType } from "@src/contracts/analytics/types/event.types";
import type EventDefinition from "@src/vendors/integrations/analytics/web/event/event.class";

export interface AnalyticsVendorInterface {
  EventDefinition: AnalyticsEventDefinitionConstructorType;
  GoogleAnalytics: new () => AnalyticsVendorGoogleAnalyticsInterface;
}

export interface AnalyticsVendorGoogleAnalyticsInterface {
  event: (event: EventDefinition) => void;
  initialize: (analyticsID: string) => void;
  routeChange: (url: string) => void;
}
