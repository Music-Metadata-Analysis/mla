// TODO: Rename

const apiEndpoints = {
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
    reports: {
      lastfm: {
        top20albums: "/api/v2/reports/lastfm/top20albums/:username",
        top20artists: "/api/v2/reports/lastfm/top20artists/:username",
        top20tracks: "/api/v2/reports/lastfm/top20tracks/:username",
      },
    },
  },
};

export default apiEndpoints;
