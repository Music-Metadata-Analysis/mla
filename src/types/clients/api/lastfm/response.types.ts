import type { LastFMImageDataInterface } from "@src/contracts/api/exports/lastfm/element.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type {
  BaseReportResponseInterface,
  AggregateBaseReportResponseInterface,
} from "@src/types/integrations/base.types";

export type {
  LastFMArtistTopAlbumsInterface,
  LastFMAlbumInfoInterface,
  LastFMTrackInfoInterface,
} from "@src/contracts/api/exports/lastfm/datapoint.types";
export type {
  LastFMImageDataInterface,
  LastFMUserProfileInterface,
} from "@src/contracts/api/exports/lastfm/element.types";
export type {
  LastFMUserAlbumInterface,
  LastFMUserArtistInterface,
  LastFMUserTrackInterface,
  LastFMTopAlbumsReportResponseInterface,
  LastFMTopArtistsReportResponseInterface,
  LastFMTopTracksReportResponseInterface,
} from "@src/contracts/api/exports/lastfm/report.types";

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
