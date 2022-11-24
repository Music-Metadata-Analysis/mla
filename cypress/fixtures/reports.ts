import lastfm from "@locales/lastfm.json";

export const flipCardReports = [
  {
    reportName: lastfm.select.reports.topAlbums,
    title: lastfm.top20Albums.title,
    searchTitle: lastfm.top20Albums.searchTitle,
  },
  {
    reportName: lastfm.select.reports.topArtists,
    title: lastfm.top20Artists.title,
    searchTitle: lastfm.top20Artists.searchTitle,
  },
  {
    reportName: lastfm.select.reports.topTracks,
    title: lastfm.top20Tracks.title,
    searchTitle: lastfm.top20Tracks.searchTitle,
  },
];

export const sunBurstReports = [
  {
    reportName: lastfm.select.reports.playCountByArtist,
    title: lastfm.playCountByArtist.title,
    searchTitle: lastfm.playCountByArtist.searchTitle,
  },
];
