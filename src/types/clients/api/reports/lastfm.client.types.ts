import type APIClient from "../../../../clients/api/api.client.class";
import type { EventCreatorType, ReportType } from "../../../analytics.types";
import type { ApiResponse } from "../../../clients/api/api.client.types";
import type { IntegrationTypes } from "../../../integration.types";
import type { BaseReportResponseInterface } from "../../../integrations/base.types";
import type {
  LastFMAlbumDataInterface,
  LastFMArtistDataInterface,
  LastFMImageDataInterface,
  LastFMTrackDataInterface,
} from "../../../integrations/lastfm/api.types";
import type { userDispatchType } from "../../../user/context.types";
import type { TFunction } from "next-i18next";

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

export interface LastFMFlipCardCommonDrawerInterface<T> {
  userState: T;
  albumIndex: number;
  fallbackImage: string;
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
}

export interface LastFMTopBaseReportResponseInterface
  extends BaseReportResponseInterface {
  image: LastFMImageDataInterface[];
  playcount: number;
}

export interface LastFMTopAlbumsReportResponseInterface
  extends LastFMTopBaseReportResponseInterface {
  albums: LastFMAlbumDataInterface[];
}

export interface LastFMTopArtistsReportResponseInterface
  extends LastFMTopBaseReportResponseInterface {
  artists: LastFMArtistDataInterface[];
}

export interface LastFMTopTracksReportResponseInterface
  extends LastFMTopBaseReportResponseInterface {
  tracks: LastFMTrackDataInterface[];
}
