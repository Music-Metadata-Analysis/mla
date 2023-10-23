import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import type { GenericApiClientHandlerType } from "@src/web/api/generics/types/generic.api.client.types";
import type { ReportCacheRetrieveClientParamsInterface } from "@src/web/api/report.cache/types/cache.report.api.client.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

export const handleSuccessful: GenericApiClientHandlerType<
  ReportStateInterface,
  ReportCacheRetrieveClientParamsInterface
> = ({ dispatcher, eventDispatcher, response, typeName }) => {
  if (response.ok) {
    dispatcher({
      type: "SuccessRetrieveCachedReport",
      cachedReportState: response.response as ReportStateInterface,
    });
    eventDispatcher(
      new analyticsVendor.collection.EventDefinition({
        category: "CACHE",
        label: "RESPONSE",
        action: `${typeName}: CACHE HIT FROM CDN.`,
      })
    );
  }
  return response;
};
