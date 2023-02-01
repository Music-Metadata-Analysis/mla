import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";

export interface LastFMPlayCountByArtistResponseInterface
  extends LastFMUserProfileInterface {
  playCountByArtist: LastFMAggregateReportResponseInterface<
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
