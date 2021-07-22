import apiEndpoints from "../../../config/apiEndpoints";
import Events from "../../../config/events";
import HTTPClient from "../../../utils/http.class";
import type { eventCreatorType } from "../../../types/analytics.types";
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
  private event: eventCreatorType;
  private client: HTTPClient;
  private integration: IntegrationTypes;

  constructor(dispatch: userDispatchType, event: eventCreatorType) {
    this.dispatch = dispatch;
    this.event = event;
    this.client = new HTTPClient();
    this.integration = "LAST.FM";
  }

  private handleBegin(userName: string): void {
    this.event(Events.LastFM.RequestAlbumsReport);
    this.dispatch({
      type: "StartFetchUser",
      userName: userName,
      integration: this.integration,
    });
  }

  private handleSuccessful(
    userName: string,
    response: ProxyResponse<LastFMTopAlbumsReportResponseInterface>
  ): void {
    if (response.status === 200) {
      this.dispatch({
        type: "SuccessFetchUser",
        userName: userName,
        data: response.response,
        integration: this.integration,
      });
      this.event(Events.LastFM.SuccessAlbumsReport);
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
      this.event(Events.LastFM.Ratelimited);
    }
  }

  private handleFailure(userName: string): void {
    this.dispatch({
      type: "FailureFetchUser",
      userName: userName,
      integration: this.integration,
    });
    this.event(Events.LastFM.ErrorAlbumsReport);
  }

  retrieveAlbumReport(userName: string): void {
    this.handleBegin(userName);
    this.client
      .post<ProxyRequestInterface, LastFMTopAlbumsReportResponseInterface>(
        apiEndpoints.v1.reports.lastfm.albums,
        {
          userName,
        }
      )
      .then((response) => {
        this.handleSuccessful(userName, response);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.handleRatelimited(userName, response);
        return Promise.resolve(response);
      })
      .catch(() => {
        this.handleFailure(userName);
      });
  }
}

export default LastFMReport;
