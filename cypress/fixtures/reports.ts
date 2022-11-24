import lastfm from "@locales/lastfm.json";

export const flipCardReports = [
  {
    reportName: lastfm.select.reports.topAlbums,
    title: lastfm.top20Albums.title,
    searchTitle: lastfm.top20Albums.searchTitle,
    indicator: lastfm.select.indicators.topAlbums,
  },
  {
    reportName: lastfm.select.reports.topArtists,
    title: lastfm.top20Artists.title,
    searchTitle: lastfm.top20Artists.searchTitle,
    indicator: lastfm.select.indicators.topArtists,
  },
  {
    reportName: lastfm.select.reports.topTracks,
    title: lastfm.top20Tracks.title,
    searchTitle: lastfm.top20Tracks.searchTitle,
    indicator: lastfm.select.indicators.topTracks,
  },
];

export const sunBurstReports = [
  {
    reportName: lastfm.select.reports.playCountByArtist,
    title: lastfm.playCountByArtist.title,
    searchTitle: lastfm.playCountByArtist.searchTitle,
    indicator: lastfm.select.indicators.playCountByArtist,
  },
];
