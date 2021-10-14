const routes = {
  about: "/about",
  home: "/",
  reports: {
    lastfm: {
      top20albums: "/reports/lastfm/top20albums",
      top20artists: "/reports/lastfm/top20artists",
    },
  },
  search: {
    lastfm: {
      selection: "/search/lastfm",
      top20albums: "/search/lastfm/top20albums",
      top20artists: "/search/lastfm/top20artists",
    },
  },
  404: "/not/a/valid/page",
};

export default routes;
