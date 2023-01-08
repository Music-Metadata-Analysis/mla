import type { LastFMUserProfileInterface } from "@src/contracts/api/exports/lastfm/element.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/reports/generics/aggregate.types";

export interface LastFMPlayCountByArtistResponseInterface
  extends LastFMUserProfileInterface {
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
