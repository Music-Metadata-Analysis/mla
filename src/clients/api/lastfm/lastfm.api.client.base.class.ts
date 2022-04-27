import EventDefinition from "../../../events/event.class";
import HTTPClient from "../api.client.class";
import type {
  EventCreatorType,
  IntegrationRequestType,
} from "../../../types/analytics.types";
import type { ApiResponse } from "../../../types/clients/api/api.client.types";
import type {
  LastFMReportInterface,
  LastFMReportParamsInterface,
} from "../../../types/clients/api/lastfm/request.types";
import type { BaseReportResponseInterface } from "../../../types/integrations/base.types";
import type { userDispatchType } from "../../../types/user/context.types";

class LastFMBaseClient<ResponseType>
  implements LastFMReportInterface<ResponseType>
{
  client: HTTPClient;
  dispatch: userDispatchType;
  eventDispatch: EventCreatorType;
  eventType = "BASE" as IntegrationRequestType;
  integration = "LAST.FM" as const;
  response!: ApiResponse<ResponseType>;
  route!: string;
  invalidRetryHeaderError = "TimeoutFetchUser, with invalid retry header.";

  constructor(dispatch: userDispatchType, event: EventCreatorType) {
    this.dispatch = dispatch;
    this.eventDispatch = event;
    this.client = new HTTPClient();
  }

  handleBegin(userName: string): void {
    this.eventDispatch(
      new EventDefinition({
        category: "LAST.FM",
        label: "REQUEST",
        action: `${this.eventType}: REQUEST WAS SENT TO LAST.FM.`,
      })
    );
    this.dispatch({
      type: "StartFetchUser",
      userName,
      integration: this.integration,
    });
  }

  handleNotFound(userName: string): void {
    if (this.response.status === 404) {
      this.dispatch({
        type: "NotFoundFetchUser",
        userName,
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

  handleSuccessful(userName: string): void {
    if (this.response.status === 200) {
      this.dispatch({
        type: "SuccessFetchUser",
        userName,
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

  handleRatelimited(userName: string): void {
    if (this.response.status === 429) {
      this.dispatch({
        type: "RatelimitedFetchUser",
        userName,
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

  handleTimeout(userName: string): void {
    if (this.response.status === 503) {
      const backOff = parseInt(this.response?.headers["retry-after"]);
      if (!isNaN(backOff)) {
        setTimeout(() => {
          this.dispatch({
            type: "TimeoutFetchUser",
            userName,
            integration: this.integration,
          });
        }, backOff * 1000);
      } else {
        throw new Error(this.invalidRetryHeaderError);
      }
    }
  }

  handleUnauthorized(userName: string): void {
    if (this.response.status === 401) {
      this.dispatch({
        type: "UnauthorizedFetchUser",
        userName,
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

  handleFailure(userName: string): void {
    this.dispatch({
      type: "FailureFetchUser",
      userName,
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

  retrieveReport(params: LastFMReportParamsInterface): void {
    this.handleBegin(params.userName);
    this.request(params);
  }

  private prepareURL(params: LastFMReportParamsInterface): string {
    let customizedRoute = this.route;
    for (const [key, value] of Object.entries(params)) {
      customizedRoute = customizedRoute.replace(`:${key.toLowerCase()}`, value);
    }
    return customizedRoute;
  }

  private request(params: LastFMReportParamsInterface): void {
    const url = this.prepareURL(params);
    this.client
      .request<ResponseType>(url)
      .then((response) => {
        this.response = response;
        this.handleNotFound(params.userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleRatelimited(params.userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleTimeout(params.userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleUnauthorized(params.userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleSuccessful(params.userName);
        return Promise.resolve(response);
      })
      .catch(() => {
        this.handleFailure(params.userName);
      });
  }
}

export default LastFMBaseClient;
