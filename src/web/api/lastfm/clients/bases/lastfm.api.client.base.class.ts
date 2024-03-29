import { serviceFailureStatusCodes } from "@src/config/api";
import settings from "@src/config/lastfm";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import HTTPClient from "@src/web/api/transport/clients/http.client.class";
import type { HttpApiClientResponse } from "@src/contracts/api/types/clients/http.client.types";
import type { LastFMReportClientParamsInterface } from "@src/contracts/api/types/clients/lastfm.client.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type { IntegrationRequestType } from "@src/web/analytics/collection/types/analytics.types";
import type { LastFMReportClientInterface } from "@src/web/api/lastfm/types/lastfm.api.client.types";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type { LastFMBaseReportInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.base.report.types";

abstract class LastFMReportBaseClient<ResponseType>
  implements LastFMReportClientInterface
{
  protected client: HTTPClient;
  protected dispatch: reportDispatchType;
  protected eventDispatch: EventCreatorType;
  protected eventType = "BASE" as IntegrationRequestType;
  protected integration = "LASTFM" as const;
  protected response!: HttpApiClientResponse<ResponseType>;
  protected abstract route: string;
  protected invalidRetryHeaderError =
    "TimeoutFetch, with invalid retry header.";

  constructor(dispatch: reportDispatchType, event: EventCreatorType) {
    this.dispatch = dispatch;
    this.eventDispatch = event;
    this.client = new HTTPClient(serviceFailureStatusCodes.lastfm);
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
      new analyticsVendor.collection.EventDefinition({
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
        new analyticsVendor.collection.EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: REQUEST WAS MADE FOR AN UNKNOWN ENTITY.`,
        })
      );
    }
  }

  protected handleSuccessful(params: LastFMReportClientParamsInterface): void {
    if (this.response.ok) {
      this.dispatch({
        type: "SuccessFetch",
        data: this.response.response as unknown as LastFMBaseReportInterface,
        integration: this.integration,
        userName: params.userName,
        userProfile: `${settings.homePage}/user/${params.userName}`,
      });
      this.eventDispatch(
        new analyticsVendor.collection.EventDefinition({
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
        new analyticsVendor.collection.EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: REQUEST WAS RATELIMITED BY LAST.FM.`,
        })
      );
    }
  }

  protected handleTimeout(params: LastFMReportClientParamsInterface): void {
    if (this.response.status === 503) {
      const backOff = parseInt(this.response.headers["retry-after"]);
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
        new analyticsVendor.collection.EventDefinition({
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
      new analyticsVendor.collection.EventDefinition({
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
        this.handleRatelimited(params);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.handleTimeout(params);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.handleUnauthorized(params);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.handleSuccessful(params);
        return Promise.resolve(response);
      })
      .catch(() => {
        this.handleFailure(params);
      });
  }
}

export default LastFMReportBaseClient;
