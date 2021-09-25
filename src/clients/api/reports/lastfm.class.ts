import apiRoutes from "../../../config/apiRoutes";
import Events from "../../../events/events";
import HTTPClient from "../../http.class";
import type { EventCreatorType } from "../../../types/analytics.types";
import type {
  LastFMTopAlbumsReportInterface,
  LastFMTopAlbumsReportResponseInterface,
} from "../../../types/clients/api/reports/lastfm.types";
import type { IntegrationTypes } from "../../../types/integration.types";
import type {
  ProxyRequestInterface,
  ProxyResponse,
} from "../../../types/proxy.types";
import type { userDispatchType } from "../../../types/user/context.types";

class LastFMReport implements LastFMTopAlbumsReportInterface {
  private dispatch: userDispatchType;
  private eventDispatch: EventCreatorType;
  private client: HTTPClient;
  private integration: IntegrationTypes;
  private events = Events.LastFM.Top20Albums;

  constructor(dispatch: userDispatchType, event: EventCreatorType) {
    this.dispatch = dispatch;
    this.eventDispatch = event;
    this.client = new HTTPClient();
    this.integration = "LAST.FM";
  }

  private handleBegin(userName: string): void {
    this.eventDispatch(this.events.RequestAlbumsReport);
    this.dispatch({
      type: "StartFetchUser",
      userName: userName,
      integration: this.integration,
    });
  }

  private handleNotFound(
    userName: string,
    response: ProxyResponse<LastFMTopAlbumsReportResponseInterface>
  ): void {
    if (response.status === 404) {
      this.dispatch({
        type: "NotFoundFetchUser",
        userName: userName,
        integration: this.integration,
      });
      this.eventDispatch(this.events.NotFound);
    }
  }

  private handleSuccessful(
    userName: string,
    response: ProxyResponse<LastFMTopAlbumsReportResponseInterface>
  ): void {
    if (response.status === 200) {
      this.dispatch({
        type: "SuccessFetchUser",
        userName: userName,
        data: response.response as LastFMTopAlbumsReportResponseInterface,
        integration: this.integration,
      });
      this.eventDispatch(this.events.SuccessAlbumsReport);
    }
  }

  private handleRatelimited(
    userName: string,
    response: ProxyResponse<LastFMTopAlbumsReportResponseInterface>
  ): void {
    if (response.status === 429) {
      this.dispatch({
        type: "RatelimitedFetchUser",
        userName: userName,
        integration: this.integration,
      });
      this.eventDispatch(this.events.Ratelimited);
    }
  }

  private handleFailure(userName: string): void {
    this.dispatch({
      type: "FailureFetchUser",
      userName: userName,
      integration: this.integration,
    });
    this.eventDispatch(this.events.ErrorAlbumsReport);
  }

  retrieveAlbumReport(userName: string): void {
    this.handleBegin(userName);
    this.client
      .post<ProxyRequestInterface, LastFMTopAlbumsReportResponseInterface>(
        apiRoutes.v1.reports.lastfm.top20albums,
        {
          userName,
        }
      )
      .then((response) => {
        this.handleNotFound(userName, response);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.handleRatelimited(userName, response);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.handleSuccessful(userName, response);
        return Promise.resolve(response);
      })
      .catch(() => {
        this.handleFailure(userName);
      });
  }
}

export default LastFMReport;
