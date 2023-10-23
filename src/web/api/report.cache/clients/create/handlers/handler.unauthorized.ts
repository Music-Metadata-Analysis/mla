import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import type { ReportCacheCreateResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type { GenericApiClientHandlerType } from "@src/web/api/generics/types/generic.api.client.types";
import type { ReportCacheCreateClientParamsInterface } from "@src/web/api/report.cache/types/cache.report.api.client.types";

export const handleUnauthorized: GenericApiClientHandlerType<
  ReportCacheCreateResponseInterface,
  ReportCacheCreateClientParamsInterface
> = ({ dispatcher, eventDispatcher, response, typeName }) => {
  if (response.status === 401) {
    eventDispatcher(
      new analyticsVendor.collection.EventDefinition({
        category: "CACHE",
        label: "ERROR",
        action: `${typeName}: AN UNAUTHORIZED REQUEST WAS MADE.`,
      })
    );
    dispatcher({
      type: "FailureCreateCachedReport",
    });
  }
  return response;
};
