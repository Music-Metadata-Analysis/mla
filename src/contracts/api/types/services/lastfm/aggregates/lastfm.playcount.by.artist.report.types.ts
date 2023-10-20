import type { LastFMAggregateReportResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";

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
