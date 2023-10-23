import { handleFailure } from "./handlers/handler.failure";
import { handleNotFound } from "./handlers/handler.not.found";
import { handleSuccessful } from "./handlers/handler.successful";
import { serviceFailureStatusCodes } from "@src/config/api";
import apiRoutes from "@src/config/apiRoutes";
import { settings as cacheSettings } from "@src/config/cache";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import GenericApiAbstractClient from "@src/web/api/generics/service/generic.service.client.class";
import HttpApiClient from "@src/web/api/transport/clients/http.client.class";
import QueryString from "@src/web/ui/window/location/window.location.query.string";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type {
  ReportCacheRetrieveClientInterface,
  ReportCacheRetrieveClientParamsInterface,
} from "@src/web/api/report.cache/types/cache.report.api.client.types";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReportRetrieveCreateClient
  extends GenericApiAbstractClient<
    ReportStateInterface,
    ReportCacheRetrieveClientParamsInterface
  >
  implements ReportCacheRetrieveClientInterface
{
  protected cacheQueryStringName = cacheSettings.cacheQueryStringIdentifier;
  protected client: HttpApiClient;
  protected configuredIntegrationRequestType = "RETRIEVE REPORT CACHE" as const;
  protected configuredParamsMappings = {
    ":report": "reportName",
    ":source": "sourceName",
  };
  protected configuredErrorHandler = handleFailure;
  protected configuredHandlers = [handleSuccessful, handleNotFound];
  protected configuredQueryMappings = {
    username: "userName",
  };
  protected queryStringClient: QueryString;
  public readonly route = apiRoutes.v2.cache.retrieve;

  constructor(dispatch: reportDispatchType, event: EventCreatorType) {
    super(dispatch, event);
    this.queryStringClient = new QueryString();
    this.client = new HttpApiClient(serviceFailureStatusCodes.reportCacheCdn);
  }

  async lookup(params: ReportCacheRetrieveClientParamsInterface): Promise<{
    bypassed: boolean;
  }> {
    const bypassed = this.getCacheQueryString() === "0";
    if (!bypassed) {
      this.handleBegin(params);
      const response = await this.request(params, "GET");
      if (response && response.ok) {
        this.writeQueryString();
      }
    }
    return { bypassed };
  }

  protected getCacheQueryString(): string | null {
    return this.queryStringClient.get(this.cacheQueryStringName);
  }

  protected handleBegin(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ReportCacheRetrieveClientParamsInterface
  ): void {
    this.dispatcher({
      type: "StartRetrieveCachedReport",
    });
    this.eventDispatcher(
      new analyticsVendor.collection.EventDefinition({
        category: "CACHE",
        label: "REQUEST",
        action: `${this.configuredIntegrationRequestType}: REQUEST SENT TO CDN.`,
      })
    );
  }

  protected writeQueryString(): void {
    this.queryStringClient.update({
      [this.cacheQueryStringName]: "1",
    });
  }
}

export default ReportRetrieveCreateClient;
