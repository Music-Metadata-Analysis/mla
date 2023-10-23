import { handleFailure } from "./handlers/handler.failure";
import { handleSuccessful } from "./handlers/handler.successful";
import { handleUnauthorized } from "./handlers/handler.unauthorized";
import { serviceFailureStatusCodes } from "@src/config/api";
import apiRoutes from "@src/config/apiRoutes";
import { settings as cacheSettings } from "@src/config/cache";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import GenericApiAbstractClient from "@src/web/api/generics/service/generic.service.client.class";
import HttpApiClient from "@src/web/api/transport/clients/http.client.class";
import QueryString from "@src/web/ui/window/location/window.location.query.string";
import type { ReportCacheCreateResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type {
  ReportCacheCreateClientInterface,
  ReportCacheCreateClientParamsInterface,
} from "@src/web/api/report.cache/types/cache.report.api.client.types";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";

class ReportCacheCreateClient
  extends GenericApiAbstractClient<
    ReportCacheCreateResponseInterface,
    ReportCacheCreateClientParamsInterface
  >
  implements ReportCacheCreateClientInterface
{
  protected cacheQueryStringName = cacheSettings.cacheQueryStringIdentifier;
  protected client: HttpApiClient;
  protected configuredIntegrationRequestType = "CREATE REPORT CACHE" as const;
  protected configuredParamsMappings = {
    ":report": "reportName",
    ":source": "sourceName",
    ":username": "userName",
  };
  protected configuredErrorHandler = handleFailure;
  protected configuredHandlers = [handleSuccessful, handleUnauthorized];
  protected configuredQueryMappings = {};
  protected queryStringClient: QueryString;
  public readonly route = apiRoutes.v2.cache.create;

  constructor(dispatch: reportDispatchType, event: EventCreatorType) {
    super(dispatch, event);
    this.queryStringClient = new QueryString();
    this.client = new HttpApiClient(serviceFailureStatusCodes.reportCache);
  }

  async populate(params: ReportCacheCreateClientParamsInterface): Promise<{
    bypassed: boolean;
  }> {
    const bypassed = this.getCacheQueryString() === "1";
    if (!bypassed) {
      this.handleBegin(params);
      const response = await this.request(params, "POST");
      if (response && response.ok) {
        this.clearQueryString();
      }
    }
    return { bypassed };
  }

  protected getCacheQueryString(): string | null {
    return this.queryStringClient.get(this.cacheQueryStringName);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleBegin(params: ReportCacheCreateClientParamsInterface): void {
    this.eventDispatcher(
      new analyticsVendor.collection.EventDefinition({
        category: "CACHE",
        label: "REQUEST",
        action: `${this.configuredIntegrationRequestType}: REQUEST SENT TO CDN ORGIN.`,
      })
    );
    this.dispatcher({
      type: "StartCreateCachedReport",
    });
  }

  protected clearQueryString(): void {
    this.queryStringClient.remove([this.cacheQueryStringName]);
  }
}

export default ReportCacheCreateClient;
