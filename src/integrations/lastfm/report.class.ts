import apiEndpoints from "../../config/apiEndpoints";
import Events from "../../config/events";
import HTTPClient from "../../utils/http.class";
import type { eventCreatorType } from "../../types/analytics.types";
import type {
  LastFMTopAlbumsProxyResponseInterface,
  LastFMTopAlbumsReportInterface,
} from "../../types/lastfm.types";
import type { ProxyRequestInterface } from "../../types/proxy.types";
import type { userDispatchType } from "../../types/user.types";

class LastFMReportRequest implements LastFMTopAlbumsReportInterface {
  private dispatch: userDispatchType;
  private event: eventCreatorType;
  private client: HTTPClient;

  constructor(dispatch: userDispatchType, event: eventCreatorType) {
    this.dispatch = dispatch;
    this.event = event;
    this.client = new HTTPClient();
  }

  retrieveAlbumReport(userName: string): void {
    this.client
      .post<ProxyRequestInterface, LastFMTopAlbumsProxyResponseInterface>(
        apiEndpoints.v1.reports.lastfm.albums,
        {
          userName,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          this.dispatch({
            type: "SuccessFetchUser",
            userName: userName,
            data: response.response as LastFMTopAlbumsProxyResponseInterface,
          });
          this.event(Events.LastFM.SuccessAlbumsReport);
        }
        return Promise.resolve(response);
      })
      .then((response) => {
        if (response.status === 429) {
          this.dispatch({
            type: "RatelimitedFetchUser",
            userName: userName,
          });
          this.event(Events.LastFM.Ratelimited);
        }
        return Promise.resolve(response);
      })
      .catch(() => {
        this.dispatch({
          type: "FailureFetchUser",
          userName: userName,
        });
        this.event(Events.LastFM.ErrorAlbumsReport);
      });
  }
}

export default LastFMReportRequest;
