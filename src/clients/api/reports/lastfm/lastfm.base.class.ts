import EventDefinition from "../../../../events/event.class";
import HTTPClient from "../../api.client.class";
import type {
  EventCreatorType,
  ReportType,
} from "../../../../types/analytics.types";
import type { ApiResponse } from "../../../../types/clients/api/api.client.types";
import type { LastFMReportInterface } from "../../../../types/clients/api/reports/lastfm.client.types";
import type { BaseReportResponseInterface } from "../../../../types/integrations/base.types";
import type { LastFMProxyRequestInterface } from "../../../../types/integrations/lastfm/proxy.types";
import type { userDispatchType } from "../../../../types/user/context.types";

class LastFMBaseReport<ResponseType>
  implements LastFMReportInterface<ResponseType>
{
  client: HTTPClient;
  dispatch: userDispatchType;
  eventDispatch: EventCreatorType;
  eventType = "BASE REPORT" as ReportType;
  integration = "LAST.FM" as const;
  response: ApiResponse<ResponseType> | undefined;
  route: string | undefined;
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
      userName: userName,
      integration: this.integration,
    });
  }

  handleNotFound(userName: string): void {
    if (this.response?.status === 404) {
      this.dispatch({
        type: "NotFoundFetchUser",
        userName: userName,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: REQUEST WAS MADE FOR AN UNKNOWN USERNAME.`,
        })
      );
    }
  }

  handleSuccessful(userName: string): void {
    if (this.response?.status === 200) {
      this.dispatch({
        type: "SuccessFetchUser",
        userName: userName,
        data: this.response.response as unknown as BaseReportResponseInterface,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "RESPONSE",
          action: `${this.eventType}: RECEIVED REPORT FROM LAST.FM.`,
        })
      );
    }
  }

  handleRatelimited(userName: string): void {
    if (this.response?.status === 429) {
      this.dispatch({
        type: "RatelimitedFetchUser",
        userName: userName,
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
    if (this.response?.status === 503) {
      const backOff = parseInt(this.response?.headers["retry-after"]);
      if (!isNaN(backOff)) {
        setTimeout(() => {
          this.dispatch({
            type: "TimeoutFetchUser",
            userName: userName,
            integration: this.integration,
          });
        }, backOff * 1000);
      } else {
        throw new Error(this.invalidRetryHeaderError);
      }
    }
  }

  handleUnauthorized(userName: string): void {
    if (this.response?.status === 401) {
      this.dispatch({
        type: "UnauthorizedFetchUser",
        userName: userName,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: AN UNAUTHORIZED REPORT REQUEST WAS MADE.`,
        })
      );
    }
  }

  handleFailure(userName: string): void {
    this.dispatch({
      type: "FailureFetchUser",
      userName: userName,
      integration: this.integration,
    });
    this.eventDispatch(
      new EventDefinition({
        category: "LAST.FM",
        label: "ERROR",
        action: `${this.eventType}: ERROR CREATING REPORT.`,
      })
    );
  }

  retrieveReport(userName: string): void {
    this.handleBegin(userName);
    this.client
      .post<LastFMProxyRequestInterface, ResponseType>(this.route as string, {
        userName,
      })
      .then((response) => {
        this.response = response;
        this.handleNotFound(userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleRatelimited(userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleTimeout(userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleUnauthorized(userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleSuccessful(userName);
        return Promise.resolve(response);
      })
      .catch(() => {
        this.handleFailure(userName);
      });
  }
}

export default LastFMBaseReport;
