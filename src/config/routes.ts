const routes = {
  about: "/about",
  home: "/",
  legal: {
    privacy: "/legal/privacy",
    terms: "/legal/terms",
  },
  reports: {
    lastfm: {
      playCountByArtist: "/reports/lastfm/playCountByArtist",
      top20albums: "/reports/lastfm/top20albums",
      top20artists: "/reports/lastfm/top20artists",
      top20tracks: "/reports/lastfm/top20tracks",
    },
  },
  search: {
    lastfm: {
      playCountByArtist: "/search/lastfm/playCountByArtist",
      selection: "/search/lastfm",
      top20albums: "/search/lastfm/top20albums",
      top20artists: "/search/lastfm/top20artists",
      top20tracks: "/search/lastfm/top20tracks",
    },
  },
  404: "/not/a/valid/page",
};

export default routes;
