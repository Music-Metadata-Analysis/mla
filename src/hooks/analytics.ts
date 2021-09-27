import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import ReactGA from "react-ga";
import EventDefinition from "../events/event.class";
import { AnalyticsContext } from "../providers/analytics/analytics.provider";
import { isProduction, isTest } from "../utils/env";
import type {
  ButtonClickHandlerType,
  LinkClickHandlerType,
} from "../types/analytics.types";
import type { EventArgs } from "react-ga";

const useAnalytics = () => {
  const { initialized, setInitialized } = useContext(AnalyticsContext);
  const [isTrackingRoutes, registerTrackRoutes] = useState(false);
  const router = useRouter();

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

  const handleRouteChange = (url: string): void => {
    ReactGA.set({ page: url });
    ReactGA.pageview(url);
  };

  const event = (eventArgs: EventArgs): void => {
    if (!isProduction() && !isTest()) {
      console.group("EVENT");
      console.log(eventArgs);
      console.groupEnd();
    }
    if (initialized) {
      ReactGA.event(eventArgs);
    }
  };

  const setup = (): void => {
    if (initialized || !process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE) return;
    ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_UA_CODE, {
      debug: !isProduction(),
    });
    setInitialized(true);
    registerTrackRoutes(true);
  };

  return {
    event,
    setup,
    trackButtonClick,
    trackExternalLinkClick,
  };
};

export default useAnalytics;
