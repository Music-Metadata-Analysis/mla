import { voidFn } from "@src/utils/voids";
import type { AnalyticsContextInterface } from "@src/types/analytics.types";

const InitialValues = <AnalyticsContextInterface>{
  initialized: false,
  setInitialized: voidFn,
  setTrackingRoutes: voidFn,
  trackingRoutes: false,
};

export default InitialValues;
