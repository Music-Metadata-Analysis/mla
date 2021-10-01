import type HTTPClient from "../../../../clients/http.class";
import type { EventCreatorType, ReportType } from "../../../analytics.types";
import type { IntegrationTypes } from "../../../integration.types";
import type {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "../../../integrations/lastfm/api.types";
import type { BaseReportResponseInterface } from "../../../proxy.types";
import type { ProxyResponse } from "../../../proxy.types";
import type { userDispatchType } from "../../../user/context.types";

export interface LastFMReportInterface<T> {
  client: HTTPClient;
  dispatch: userDispatchType;
  eventDispatch: EventCreatorType;
  eventType: ReportType;
  integration: IntegrationTypes;
  response: ProxyResponse<T> | undefined;
  route: string | undefined;
  handleBegin: (userName: string) => void;
  handleNotFound: (userName: string) => void;
  handleSuccessful: (userName: string) => void;
  handleRatelimited: (userName: string) => void;
  handleFailure: (userName: string) => void;
  retrieveReport: (userName: string) => void;
}

export interface LastFMTopBaseReportResponseInterface
  extends BaseReportResponseInterface {
  image: LastFMImageDataInterface[];
}

export interface LastFMTopAlbumsReportResponseInterface
  extends LastFMTopBaseReportResponseInterface {
  albums: LastFMAlbumDataInterface[];
}
