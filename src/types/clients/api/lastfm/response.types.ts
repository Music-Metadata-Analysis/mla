import type {
  BaseReportResponseInterface,
  AggregateBaseReportResponseInterface,
} from "../../../integrations/base.types";
import type {
  LastFMAlbumDataInterface,
  LastFMArtistDataInterface,
  LastFMImageDataInterface,
  LastFMTrackDataInterface,
} from "../../../integrations/lastfm/api.types";
import type { TFunction } from "next-i18next";

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

export interface LastFMPlayCountByArtistResponseInterface
  extends LastFMTopBaseReportResponseInterface {
  playCountByArtist: AggregateBaseReportResponseInterface<
    PlayCountByArtistReportInterface[]
  >;
}

export interface PlayCountByArtistReportInterface {
  name: string;
  playcount: number | null;
  albums: PlayCountByArtistReportInterface_Artist[];
  fetched: boolean;
}

interface PlayCountByArtistReportInterface_Artist {
  name: string;
  playcount: number | null;
  tracks: PlayCountByArtistReportInterface_Track[];
  fetched: boolean;
}

interface PlayCountByArtistReportInterface_Track {
  name: string;
  rank: number;
  fetched: boolean;
}
