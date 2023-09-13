import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

export const mockUrls = ["http://someurl1.com", "http://someurl2.com"];

export const baseReportProperties: ReportStateInterface = {
  data: {
    integration: null,
    report: {
      albums: [
        {
          mbid: "Mock mbid value.",
          artist: {
            mbid: "Another mock mbid value",
          },
          image: [
            {
              size: "large" as const,
              "#text": mockUrls[0],
            },
          ],
        },
      ],
      artists: [
        {
          mbid: "Mock mbid value.",
          artist: {
            mbid: "Another mock mbid value",
          },
          image: [
            {
              size: "large" as const,
              "#text": mockUrls[0],
            },
          ],
        },
      ],
      tracks: [
        {
          mbid: "Mock mbid value.",
          artist: {
            mbid: "Another mock mbid value",
          },
          image: [
            {
              size: "large" as const,
              "#text": mockUrls[0],
            },
          ],
        },
      ],
      image: [
        {
          size: "small" as const,
          "#text": mockUrls[1],
        },
      ],
      playcount: 0,
    },
  },
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  retries: 3,
  userName: null,
};
