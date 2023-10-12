const apiRoutes = {
  v1: {
    reports: {
      lastfm: {
        top20albums: "/api/v1/reports/lastfm/top20albums",
        top20artists: "/api/v1/reports/lastfm/top20artists",
        top20tracks: "/api/v1/reports/lastfm/top20tracks",
      },
    },
  },
  v2: {
    cache: "/api/v2/cache/:source/:report/:username",
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
