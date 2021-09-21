import LastFMAlbum from "../top20.class";
import type { UserStateInterface } from "../../../types/user/state.types";

const mockUrls = ["http://someurl1.com", "http://someurl2.com"];

const mockUserProperties: UserStateInterface = {
  data: {
    integration: null,
    report: {
      albums: [
        {
          mbid: "Mock mbid value.",
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
    },
  },
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  userName: null,
};

describe("LastFMAlbum", () => {
  let album: LastFMAlbum;

  beforeEach(() => {
    album = new LastFMAlbum(mockUserProperties);
  });

  describe("getAlbumArtWork", () => {
    const validIndex = 0;
    const invalidIndex = 1;
    const validSize = "large";
    const invalidSize = "not-a-size";

    describe("when given a VALID index, and VALID size", () => {
      it("should return the expected url", () => {
        expect(album.getAlbumArtWork(validIndex, validSize)).toBe(mockUrls[0]);
      });
    });

    describe("when given an INVALID index, and valid size", () => {
      it("should return an empty string", () => {
        expect(album.getAlbumArtWork(invalidIndex, validSize)).toBe("");
      });
    });

    describe("when given an valid index, and INVALID size", () => {
      it("should return an empty string", () => {
        expect(album.getAlbumArtWork(validIndex, invalidSize)).toBe("");
      });
    });

    describe("when given an INVALID index, and INVALID size", () => {
      it("should return an empty string", () => {
        expect(album.getAlbumArtWork(invalidIndex, invalidSize)).toBe("");
      });
    });
  });
});
