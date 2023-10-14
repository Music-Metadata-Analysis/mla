import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";

const useAnalytics = () => {
  const analyticsVendorHook = analyticsVendor.collection.hook(
    analyticsVendor.ClientClass
  );
  return analyticsVendorHook;
};

export default useAnalytics;

export type AnalyticsHookType = ReturnType<typeof useAnalytics>;
