import type {
  HttpApiClientHttpMethodType,
  HttpApiClientResponse,
} from "@src/contracts/api/types/clients/http.client.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type { IntegrationRequestType } from "@src/web/analytics/collection/types/analytics.types";
import type {
  GenericApiClientInterface,
  GenericApiClientHandlerType,
} from "@src/web/api/generics/types/generic.api.client.types";
import type HTTPClient from "@src/web/api/transport/clients/http.client.class";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

abstract class GenericApiAbstractClient<
  ResponseType,
  ParamsType extends Record<string, string | ReportStateInterface>
> implements GenericApiClientInterface
{
  protected abstract client: HTTPClient;
  protected abstract configuredErrorHandler: GenericApiClientHandlerType<
    ResponseType,
    ParamsType
  >;
  protected abstract configuredIntegrationRequestType: IntegrationRequestType;
  protected abstract configuredHandlers: GenericApiClientHandlerType<
    ResponseType,
    ParamsType
  >[];
  protected abstract configuredParamsMappings: {
    [pathVariable: string]: keyof ParamsType;
  };
  protected abstract configuredQueryMappings: {
    [queryVariable: string]: keyof ParamsType;
  };
  protected dispatcher: reportDispatchType;
  protected eventDispatcher: EventCreatorType;
  protected abstract route: string;
  constructor(dispatch: reportDispatchType, event: EventCreatorType) {
    this.dispatcher = dispatch;
    this.eventDispatcher = event;
  }

  protected request(
    params: ParamsType,
    method: HttpApiClientHttpMethodType
  ): Promise<HttpApiClientResponse<ResponseType> | void> {
    const url = this.createUrlFromParams(params);
    let sessionResponse: HttpApiClientResponse<ResponseType>;
    return this.client
      .request<ResponseType>(url, this.createRequestParams(method, params))
      .then((response) => {
        sessionResponse = response;
        this.configuredHandlers.forEach((func) =>
          func({
            dispatcher: this.dispatcher,
            eventDispatcher: this.eventDispatcher,
            params,
            response,
            typeName: this.configuredIntegrationRequestType,
          })
        );
        return response;
      })
      .catch(() =>
        this.configuredErrorHandler({
          dispatcher: this.dispatcher,
          eventDispatcher: this.eventDispatcher,
          params,
          response: sessionResponse,
          typeName: this.configuredIntegrationRequestType,
        })
      );
  }

  protected createUrlFromParams(params: ParamsType) {
    let customizedRoute = this.route;
    const searchParams = this.createSearchParamsFromParams(params);
    Object.entries(this.configuredParamsMappings).forEach(([k, v]) => {
      customizedRoute = customizedRoute.replace(
        k,
        encodeURIComponent(String(params[v]))
      );
    });
    if (searchParams) {
      return [customizedRoute, "?", searchParams].join("");
    }
    return customizedRoute;
  }

  protected createSearchParamsFromParams(params: ParamsType) {
    const searchParams = new URLSearchParams();
    Object.entries(this.configuredQueryMappings).forEach(([k, v]) => {
      searchParams.set(k, String(params[v]));
    });
    return searchParams.toString();
  }

  protected createRequestParams(
    method: HttpApiClientHttpMethodType,
    params: ParamsType
  ) {
    let requestParams: {
      method: HttpApiClientHttpMethodType;
      body?: ReportStateInterface;
    } = { method };
    if (params.body) {
      requestParams = {
        ...requestParams,
        body: params.body as ReportStateInterface,
      };
    }
    return requestParams;
  }

  getRoute(): string {
    return this.route;
  }
}

export default GenericApiAbstractClient;
