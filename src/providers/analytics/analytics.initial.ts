import { voidFn } from "@src/utilities/generics/voids";
import type { AnalyticsContextInterface } from "@src/types/analytics.types";

const InitialValues = <AnalyticsContextInterface>{
  initialized: false,
  setInitialized: voidFn,
  setTrackingRoutes: voidFn,
  trackingRoutes: false,
};

export default InitialValues;
