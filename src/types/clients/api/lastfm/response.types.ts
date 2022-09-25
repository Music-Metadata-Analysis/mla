import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type {
  BaseReportResponseInterface,
  AggregateBaseReportResponseInterface,
} from "@src/types/integrations/base.types";
import type {
  LastFMAlbumDataInterface,
  LastFMArtistDataInterface,
  LastFMImageDataInterface,
  LastFMTrackDataInterface,
} from "@src/types/integrations/lastfm/api.types";

export interface LastFMFlipCardCommonDrawerInterface<T> {
  userState: T;
  albumIndex: number;
  fallbackImage: string;
  isOpen: boolean;
  onClose: () => void;
  t: tFunctionType;
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
