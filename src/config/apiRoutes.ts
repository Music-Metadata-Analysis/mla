const apiRoutes = {
  v2: {
    cache: {
      create: "/api/v2/cache/:source/:report/:username",
      retrieve: "/api/v2/cache/:source/:report",
    },
    data: {
      lastfm: {
        artists: {
          albumsList: "/api/v2/data/lastfm/artists/:artist/albums",
          albumsGet: "/api/v2/data/lastfm/artists/:artist/albums/:album",
          tracksGet:
            "/api/v2/data/lastfm/artists/:artist/albums/:album/tracks/:track",
        },
      },
    },
    reports: {
      lastfm: {
        top20albums: "/api/v2/reports/lastfm/top20albums/:username",
        top20artists: "/api/v2/reports/lastfm/top20artists/:username",
        top20tracks: "/api/v2/reports/lastfm/top20tracks/:username",
      },
    },
  },
};

export default apiRoutes;
