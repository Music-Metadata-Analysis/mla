import type EventDefinition from "../../../events/event.class";

export interface AnalyticsVendor {
  GoogleAnalytics: new () => AnalyticsVendorInterface;
}

export interface AnalyticsVendorInterface {
  event: (event: EventDefinition) => void;
  initialize: (analyticsID: string) => void;
  routeChange: (url: string) => void;
}
