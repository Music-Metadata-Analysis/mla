import { voidSetter } from "../../utils/voids";
import type { AnalyticsContextInterface } from "../../types/analytics.types";

const InitialValues = <AnalyticsContextInterface>{
  initialized: false,
  setInitialized: voidSetter,
  setTrackingRoutes: voidSetter,
  trackingRoutes: false,
};

export default InitialValues;
