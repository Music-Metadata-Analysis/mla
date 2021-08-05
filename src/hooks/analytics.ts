import { useRouter } from "next/router";
import React from "react";
import ReactGA from "react-ga";
import { AnalyticsContext } from "../providers/analytics/analytics.provider";
import Event from "../providers/analytics/event.class";
import { isProduction } from "../utils/env";
import type { ButtonClickHandlerType } from "../types/analytics.types";
import type { EventArgs } from "react-ga";

const useAnalytics = () => {
  const router = useRouter();
  const { initialized, setInitialized } = React.useContext(AnalyticsContext);

  React.useEffect(() => {
    if (!initialized) return;
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  const trackButtonClick: ButtonClickHandlerType = (e, buttonName) => {
    const clickEvent = new Event({
      category: "MAIN",
      label: "BUTTON",
      action: `CLICKED: ${buttonName}`,
    });
    event(clickEvent);
  };

  const handleRouteChange = (url: string): void => {
    ReactGA.set({ page: url });
    ReactGA.pageview(url);
  };

  const event = (eventArgs: EventArgs): void => {
    if (initialized) {
      ReactGA.event(eventArgs);
    }
  };

  const setup = (): void => {
    if (initialized || !process.env.REACT_APP_UA_CODE) return;
    ReactGA.initialize(process.env.REACT_APP_UA_CODE, {
      debug: !isProduction(),
    });
    setInitialized(true);
  };

  return {
    event,
    setup,
    trackButtonClick,
  };
};

export default useAnalytics;
