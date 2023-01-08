import HTTPClient from "../http/http.client.class";
import EventDefinition from "@src/events/event.class";
import type {
  EventCreatorType,
  IntegrationRequestType,
} from "@src/types/analytics.types";
import type { HttpApiClientResponse } from "@src/types/clients/api/http.types";
import type {
  LastFMReportClientInterface,
  LastFMReportClientParamsInterface,
} from "@src/types/clients/api/lastfm/report.client.types";
import type { BaseReportResponseInterface } from "@src/types/reports/lastfm/states/generic.types";
import type { userDispatchType } from "@src/types/user/context.types";

abstract class LastFMReportBaseClient<ResponseType>
  implements LastFMReportClientInterface
{
  protected client: HTTPClient;
  protected dispatch: userDispatchType;
  protected eventDispatch: EventCreatorType;
  protected eventType = "BASE" as IntegrationRequestType;
  protected integration = "LAST.FM" as const;
  protected response!: HttpApiClientResponse<ResponseType>;
  protected abstract route: string;
  protected invalidRetryHeaderError =
    "TimeoutFetch, with invalid retry header.";

  constructor(dispatch: userDispatchType, event: EventCreatorType) {
    this.dispatch = dispatch;
    this.eventDispatch = event;
    this.client = new HTTPClient();
  }

  retrieveReport(params: LastFMReportClientParamsInterface): void {
    this.handleBegin(params);
    this.request(params);
  }

  getRoute(): string {
    return this.route;
  }

  protected handleBegin(params: LastFMReportClientParamsInterface): void {
    this.eventDispatch(
      new EventDefinition({
        category: "LAST.FM",
        label: "REQUEST",
        action: `${this.eventType}: REQUEST WAS SENT TO LAST.FM.`,
      })
    );
    this.dispatch({
      type: "StartFetch",
      userName: params.userName,
      integration: this.integration,
    });
  }

  protected handleNotFound(params: LastFMReportClientParamsInterface): void {
    if (this.response.status === 404) {
      this.dispatch({
        type: "NotFoundFetch",
        userName: params.userName,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: REQUEST WAS MADE FOR AN UNKNOWN ENTITY.`,
        })
      );
    }
  }

  protected handleSuccessful(params: LastFMReportClientParamsInterface): void {
    if (this.response.status === 200) {
      this.dispatch({
        type: "SuccessFetch",
        userName: params.userName,
        data: this.response.response as unknown as BaseReportResponseInterface,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "RESPONSE",
          action: `${this.eventType}: RECEIVED RESPONSE FROM LAST.FM.`,
        })
      );
    }
  }

  protected handleRatelimited(params: LastFMReportClientParamsInterface): void {
    if (this.response.status === 429) {
      this.dispatch({
        type: "RatelimitedFetch",
        userName: params.userName,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: REQUEST WAS RATELIMITED BY LAST.FM.`,
        })
      );
    }
  }

  protected handleTimeout(params: LastFMReportClientParamsInterface): void {
    if (this.response.status === 503) {
      const backOff = parseInt(this.response?.headers["retry-after"]);
      if (!isNaN(backOff)) {
        setTimeout(() => {
          this.dispatch({
            type: "TimeoutFetch",
            userName: params.userName,
            integration: this.integration,
          });
        }, backOff * 1000);
      } else {
        throw new Error(this.invalidRetryHeaderError);
      }
    }
  }

  protected handleUnauthorized(
    params: LastFMReportClientParamsInterface
  ): void {
    if (this.response.status === 401) {
      this.dispatch({
        type: "UnauthorizedFetch",
        userName: params.userName,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: AN UNAUTHORIZED REQUEST WAS MADE.`,
        })
      );
    }
  }

  protected handleFailure(params: LastFMReportClientParamsInterface): void {
    this.dispatch({
      type: "FailureFetch",
      userName: params.userName,
      integration: this.integration,
    });
    this.eventDispatch(
      new EventDefinition({
        category: "LAST.FM",
        label: "ERROR",
        action: `${this.eventType}: ERROR DURING REQUEST.`,
      })
    );
  }

  protected attachParamsToUrl(params: LastFMReportClientParamsInterface) {
    let customizedRoute = this.route;
    for (const [key, value] of Object.entries(params)) {
      customizedRoute = customizedRoute.replace(
        `:${key.toLowerCase()}`,
        encodeURIComponent(value)
      );
    }
    if (!this.route.includes(":username")) {
      const mockPrefix = "http://site";
      const searchUrl = new URL(mockPrefix + customizedRoute);
      searchUrl.searchParams.set("username", params.userName);
      customizedRoute = searchUrl.toString().replace(mockPrefix, "");
    }
    return customizedRoute;
  }

  protected request(params: LastFMReportClientParamsInterface): void {
    const url = this.attachParamsToUrl(params);
    this.client
      .request<ResponseType>(url)
      .then((response) => {
        this.response = response;
        this.handleNotFound(params);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleRatelimited(params);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleTimeout(params);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleUnauthorized(params);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleSuccessful(params);
        return Promise.resolve(response);
      })
      .catch(() => {
        this.handleFailure(params);
      });
  }
}

export default LastFMReportBaseClient;
