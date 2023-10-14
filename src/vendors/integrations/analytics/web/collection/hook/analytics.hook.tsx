import { useContext } from "react";
import { AnalyticsContext } from "../provider/analytics.provider";
import { isProduction, isTest } from "@src/utilities/generics/env";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";
import type {
  AnalyticsVendorHookInterface,
  AnalyticsVendorClientInterface,
} from "@src/vendors/types/integrations/analytics/vendor.types";

const useAnalyticsClient = (
  AnalyticsClientClass: new () => AnalyticsVendorClientInterface
) => {
  const { initialized, setInitialized } = useContext(AnalyticsContext);
  const analytics = new AnalyticsClientClass();

  const trackButtonClick = (
    e: React.BaseSyntheticEvent,
    buttonName: React.ReactNode | string
  ) => {
    const clickEvent = new analyticsVendor.collection.EventDefinition({
      category: "MAIN",
      label: "BUTTON",
      action: `CLICKED: ${buttonName}`,
    });
    event(clickEvent);
  };

  const trackExternalLinkClick = (
    e: React.BaseSyntheticEvent,
    href: string
  ) => {
    const clickEvent = new analyticsVendor.collection.EventDefinition({
      category: "MAIN",
      label: "EXTERNAL_LINK",
      action: `VISITED: ${href}`,
    });
    event(clickEvent);
  };

  const trackInternalLinkClick = (
    e: React.BaseSyntheticEvent,
    href: string
  ) => {
    const clickEvent = new analyticsVendor.collection.EventDefinition({
      category: "MAIN",
      label: "INTERNAL_LINK",
      action: `VISITED: ${href}`,
    });
    event(clickEvent);
  };

  const event = (eventArgs: AnalyticsEventDefinitionInterface): void => {
    if (!isProduction() && !isTest()) {
      console.group("EVENT");
      console.log(eventArgs);
      console.groupEnd();
    }
    if (initialized) {
      analytics.event(eventArgs);
    }
  };

  const setup = (): void => {
    if (initialized || !process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE) return;
    analytics.initialize(process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE);
    setInitialized(true);
  };

  return {
    event,
    setup,
    trackButtonClick,
    trackExternalLinkClick,
    trackInternalLinkClick,
  };
};

export default useAnalyticsClient;

export type AnalyticsHookType = AnalyticsVendorHookInterface;
