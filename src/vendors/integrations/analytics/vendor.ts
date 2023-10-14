import GoogleAnalytics from "./web/client/google.analytics/react.ga.class";
import ConsentContainer from "./web/collection/consent/consent.container";
import EventDefinition from "./web/collection/event/event.class";
import useAnalyticsClient from "./web/collection/hook/analytics.hook";
import AnalyticsProvider from "./web/collection/provider/analytics.provider";
import type { AnalyticsVendorInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

export const analyticsVendor: AnalyticsVendorInterface = {
  ClientClass: GoogleAnalytics,
  collection: {
    ConsentBannerComponent: ConsentContainer,
    EventDefinition: EventDefinition,
    hook: useAnalyticsClient,
    Provider: AnalyticsProvider,
  },
};
