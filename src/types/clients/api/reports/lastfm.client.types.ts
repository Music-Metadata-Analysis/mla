import type APIClient from "../../../../clients/api/api.client.class";
import type { EventCreatorType, ReportType } from "../../../analytics.types";
import type { ApiResponse } from "../../../clients/api/api.client.types";
import type { IntegrationTypes } from "../../../integration.types";
import type { BaseReportResponseInterface } from "../../../integrations/base.types";
import type {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "../../../integrations/lastfm/api.types";
import type { userDispatchType } from "../../../user/context.types";

export interface LastFMReportInterface<T> {
  client: APIClient;
  dispatch: userDispatchType;
  eventDispatch: EventCreatorType;
  eventType: ReportType;
  integration: IntegrationTypes;
  response: ApiResponse<T> | undefined;
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
