import { useEffect, useContext, useState } from "react";
import useRouter from "./router.hook";
import EventDefinition from "@src/contracts/events/event.class";
import { AnalyticsContext } from "@src/providers/analytics/analytics.provider";
import { isProduction, isTest } from "@src/utils/env";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import type {
  ButtonClickHandlerType,
  LinkClickHandlerType,
} from "@src/types/analytics.types";

const useAnalytics = () => {
  const { initialized, setInitialized } = useContext(AnalyticsContext);
  const [isTrackingRoutes, registerTrackRoutes] = useState(false);
  const router = useRouter();
  const analytics = new analyticsVendor.GoogleAnalytics();

  useEffect(() => {
    if (!isTrackingRoutes) return;
    router.handlers.addRouteChangeHandler(handleRouteChange);
    return () => {
      router.handlers.removeRouteChangeHandler(handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrackingRoutes]);

  const trackButtonClick: ButtonClickHandlerType = (e, buttonName) => {
    const clickEvent = new EventDefinition({
      category: "MAIN",
      label: "BUTTON",
      action: `CLICKED: ${buttonName}`,
    });
    event(clickEvent);
  };

  const trackExternalLinkClick: LinkClickHandlerType = (e, href) => {
    const clickEvent = new EventDefinition({
      category: "MAIN",
      label: "EXTERNAL_LINK",
      action: `VISITED: ${href}`,
    });
    event(clickEvent);
  };

  const trackInternalLinkClick: LinkClickHandlerType = (e, href) => {
    const clickEvent = new EventDefinition({
      category: "MAIN",
      label: "INTERNAL_LINK",
      action: `VISITED: ${href}`,
    });
    event(clickEvent);
  };

  const handleRouteChange = (url: string): void => {
    analytics.routeChange(url);
  };

  const event = (eventArgs: EventDefinition): void => {
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
    registerTrackRoutes(true);
  };

  return {
    event,
    setup,
    trackButtonClick,
    trackExternalLinkClick,
    trackInternalLinkClick,
  };
};

export default useAnalytics;

export type AnalyticsHookType = ReturnType<typeof useAnalytics>;
