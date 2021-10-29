export const mockAlbumsReport = {
  albums: [],
  image: [
    {
      size: "large",
      "#text": "http://someurl.com",
    },
  ],
};

export const mockInitialReportData = {
  albums: [],
  artists: [],
  image: [],
  tracks: [],
};

export const mockUserStateWithError = {
  userName: "somebody",
  inProgress: false,
  ratelimited: true,
  data: {
    integration: null,
    report: mockInitialReportData,
  },
  error: "FailureFetchUser" as const,
  profileUrl: "http://localhost",
  ready: true,
  retries: 3,
};
