import lastfm from "@locales/lastfm.json";

export const flipCardReports = [
  {
    reportName: lastfm.select.reports.topAlbums,
    title: lastfm.top20Albums.title,
  },
  {
    reportName: lastfm.select.reports.topArtists,
    title: lastfm.top20Artists.title,
  },
  {
    reportName: lastfm.select.reports.topTracks,
    title: lastfm.top20Tracks.title,
  },
];

export const sunBurstReports = [
  {
    reportName: lastfm.select.reports.playCountByArtist,
    title: lastfm.playCountByArtist.title,
  },
];
