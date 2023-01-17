/* istanbul ignore file */
import type { LastFMTopTracksReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.tracks.types";

interface TestData {
  [key: string]: LastFMTopTracksReportResponseInterface;
}

const testResponses: TestData = {
  noListens: {
    tracks: [],
    image: [
      {
        size: "small",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/34s/ed8121273747692b2509dbda32f2d516.png",
      },
      {
        size: "medium",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/64s/ed8121273747692b2509dbda32f2d516.png",
      },
      {
        size: "large",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/174s/ed8121273747692b2509dbda32f2d516.png",
      },
      {
        size: "extralarge",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/300x300/ed8121273747692b2509dbda32f2d516.png",
      },
    ],
    playcount: 0,
  },
  hasListens: {
    tracks: [
      {
        streamable: { fulltrack: "0", "#text": "0" },
        mbid: "",
        name: "Non Offensive Scrobble",
        image: [
          {
            size: "small",
            "#text": "",
          },
          {
            size: "medium",
            "#text": "",
          },
          {
            size: "large",
            "#text": "",
          },
          {
            size: "extralarge",
            "#text": "",
          },
        ],
        artist: {
          url: "https://www.last.fm/music/Non+Offensive+Scrobble",
          name: "Non Offensive Scrobble",
          mbid: "",
        },
        url: "https://www.last.fm/music/Non+Offensive+Scrobble/_/Non+Offensive+Scrobble",
        duration: "0",
        "@attr": { rank: "1" },
        playcount: "1",
      },
    ],
    image: [
      {
        size: "small",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/34s/632f1fc23f8010119928baa64ae9f44b.png",
      },
      {
        size: "medium",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/64s/632f1fc23f8010119928baa64ae9f44b.png",
      },
      {
        size: "large",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/174s/632f1fc23f8010119928baa64ae9f44b.png",
      },
      {
        size: "extralarge",
        "#text":
          "https://lastfm.freetls.fastly.net/i/u/300x300/632f1fc23f8010119928baa64ae9f44b.png",
      },
    ],
    playcount: 1,
  },
};

export default testResponses;
