import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import analyticsVendor from "../clients/analytics/vendor";
import EventDefinition from "../events/event.class";
import { AnalyticsContext } from "../providers/analytics/analytics.provider";
import { isProduction, isTest } from "../utils/env";
import type {
  ButtonClickHandlerType,
  LinkClickHandlerType,
} from "../types/analytics.types";

const useAnalytics = () => {
  const { initialized, setInitialized } = useContext(AnalyticsContext);
  const [isTrackingRoutes, registerTrackRoutes] = useState(false);
  const router = useRouter();
  const analytics = new analyticsVendor.GoogleAnalytics();

  useEffect(() => {
    if (!isTrackingRoutes) return;
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
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
