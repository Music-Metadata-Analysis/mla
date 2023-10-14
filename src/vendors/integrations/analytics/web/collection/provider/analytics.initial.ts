import { voidFn } from "@src/utilities/generics/voids";
import type { AnalyticsVendorContextInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

const InitialValues = <AnalyticsVendorContextInterface>{
  initialized: false,
  setInitialized: voidFn,
  setTrackingRoutes: voidFn,
  trackingRoutes: false,
};

export default InitialValues;
