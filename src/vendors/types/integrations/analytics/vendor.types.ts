import type EventDefinition from "@src/contracts/events/event.class";

export interface AnalyticsVendorInterface {
  GoogleAnalytics: new () => AnalyticsVendorGoogleAnalyticsInterface;
}

export interface AnalyticsVendorGoogleAnalyticsInterface {
  event: (event: EventDefinition) => void;
  initialize: (analyticsID: string) => void;
  routeChange: (url: string) => void;
}
