import { voidFn } from "@src/utilities/generics/voids";
import type { AnalyticsContextInterface } from "@src/web/analytics/collection/types/state/provider.types";

const InitialValues = <AnalyticsContextInterface>{
  initialized: false,
  setInitialized: voidFn,
  setTrackingRoutes: voidFn,
  trackingRoutes: false,
};

export default InitialValues;
