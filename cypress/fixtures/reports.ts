import lastfm from "@locales/lastfm.json";
import flags from "@src/config/flags";
import routes from "@src/config/routes";
import type { CypressReportType } from "@cypress/types/reports";

export const flipCardReports: CypressReportType[] = [
  {
    reportName: lastfm.select.reports.topAlbums,
    title: lastfm.top20Albums.title,
    searchTitle: lastfm.top20Albums.searchTitle,
    indicator: lastfm.select.indicators.topAlbums,
    reportRoute: routes.reports.lastfm.top20albums,
    flag: flags.lastfm_top20_albums,
  },
  {
    reportName: lastfm.select.reports.topArtists,
    title: lastfm.top20Artists.title,
    searchTitle: lastfm.top20Artists.searchTitle,
    indicator: lastfm.select.indicators.topArtists,
    reportRoute: routes.reports.lastfm.top20artists,
    flag: flags.lastfm_top20_artists,
  },
  {
    reportName: lastfm.select.reports.topTracks,
    title: lastfm.top20Tracks.title,
    searchTitle: lastfm.top20Tracks.searchTitle,
    indicator: lastfm.select.indicators.topTracks,
    reportRoute: routes.reports.lastfm.top20tracks,
    flag: flags.lastfm_top20_tracks,
  },
];

export const sunBurstReports: CypressReportType[] = [
  {
    reportName: lastfm.select.reports.playCountByArtist,
    title: lastfm.playCountByArtist.title,
    searchTitle: lastfm.playCountByArtist.searchTitle,
    indicator: lastfm.select.indicators.playCountByArtist,
    reportRoute: routes.reports.lastfm.playCountByArtist,
    flag: flags.lastfm_playcount_by_artist,
  },
];
