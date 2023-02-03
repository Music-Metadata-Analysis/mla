export const mockAlbumsReport = {
  albums: [],
  image: [
    {
      size: "large" as const,
      "#text": "http://someurl.com",
    },
  ],
  playcount: 0,
};

export const mockInitialReportData = {
  albums: [],
  artists: [],
  playCountByArtist: {
    status: {
      complete: false,
      steps_total: 0,
      steps_complete: 0,
    },
    created: "",
    content: [],
  },
  tracks: [],
  image: [],
  playcount: 0,
};

export const mockUserStateWithError = {
  userName: "somebody",
  inProgress: false,
  ratelimited: true,
  data: {
    integration: null,
    report: mockInitialReportData,
  },
  error: "FailureFetch" as const,
  profileUrl: "http://localhost",
  ready: true,
  retries: 3,
};
