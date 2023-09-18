import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.aggregate.report.types";

export interface LastFMPlayCountByArtistResponseInterface
  extends LastFMUserProfileInterface {
  playCountByArtist: LastFMAggregateReportResponseInterface<
    PlayCountByArtistReportInterface[]
  >;
}

export interface PlayCountByArtistReportInterface {
  name: string;
  playcount: number | null;
  albums: PlayCountByArtistReportInterface_Album[];
  fetched: boolean;
}

export interface PlayCountByArtistReportInterface_Album {
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
