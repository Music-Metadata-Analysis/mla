import UserAlbumState from "../user.state.album.class";
import type {
  LastFMImageDataInterface,
  LastFMArtistDataInterface,
} from "../../../../../types/integrations/lastfm/api.types";
import type { LastFMUserStateTop20AlbumReport } from "../../../../../types/user/state.types";
import type { UserStateInterface } from "../../../../../types/user/state.types";

const mockUrls = ["http://someurl1.com", "http://someurl2.com"];

const baseUserProperties: UserStateInterface = {
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

describe("UserAlbumState", () => {
  let currentState: LastFMUserStateTop20AlbumReport;
  let instance: UserAlbumState;
  const mockT = jest.fn((arg: string) => `t(${arg})`);
  let index: number;
  let size: LastFMImageDataInterface["size"];

  const resetState = () => {
    currentState = JSON.parse(JSON.stringify(baseUserProperties));
  };

  const arrange = () => {
    instance = new UserAlbumState(currentState, mockT);
  };

  beforeEach(() => {
    resetState();
  });

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should have the correct translated default values", () => {
      expect(instance.defaultAlbumName).toBe("t(defaults.albumName)");
      expect(instance.defaultArtistName).toBe("t(defaults.artistName)");
    });

    it("should have the correct report value", () => {
      expect(instance.defaultAlbumName).toBe("t(defaults.albumName)");
      expect(instance.defaultArtistName).toBe("t(defaults.artistName)");
    });
  });

  describe("with a VALID album index value", () => {
    beforeEach(() => (index = 0));

    describe("with a VALID size", () => {
      beforeEach(() => (size = "large"));

      describe("getArtwork", () => {
        beforeEach(() => arrange());

        it("should return the expected url", () => {
          expect(instance.getArtwork(index, size)).toBe(mockUrls[0]);
        });
      });
    });

    describe("with a INVALID size", () => {
      beforeEach(
        () => (size = "not-a-valid_size" as LastFMImageDataInterface["size"])
      );

      describe("getArtwork", () => {
        it("should return an empty string", () => {
          expect(instance.getArtwork(index, size)).toBe("");
        });
      });
    });

    describe("getName", () => {
      const mockAlbumName = "mockAlbumName";

      describe("when an album name is defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].name = mockAlbumName;
          arrange();
        });

        it("should return the name", () => {
          expect(instance.getName(index)).toBe(mockAlbumName);
        });
      });

      describe("when an album name is NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].name = undefined;
          arrange();
        });

        it("should return the default name", () => {
          expect(instance.getName(index)).toBe(instance.defaultAlbumName);
        });
      });
    });

    describe("getRelatedArtistName", () => {
      const mockArtistName = "mockArtistName";

      describe("when an artist name is defined", () => {
        beforeEach(() => {
          (
            currentState.data.report.albums[0]
              .artist as LastFMArtistDataInterface
          ).name = mockArtistName;
          arrange();
        });

        it("should return the name", () => {
          expect(instance.getRelatedArtistName(index)).toBe(mockArtistName);
        });
      });

      describe("when an artist name is NOT defined", () => {
        beforeEach(() => {
          (
            currentState.data.report.albums[0]
              .artist as LastFMArtistDataInterface
          ).name = undefined;
          arrange();
        });

        it("should return the default name", () => {
          expect(instance.getRelatedArtistName(index)).toBe(
            instance.defaultArtistName
          );
        });
      });
    });

    describe("getExternalLink", () => {
      const mockUrl = "http://some.com/url";

      describe("when the album link is defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].url = mockUrl;
          arrange();
        });

        it("should return the name", () => {
          expect(instance.getExternalLink(index)).toBe(mockUrl);
        });
      });

      describe("when the album link is NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].url = undefined;
          arrange();
        });

        it("should return the default name (url encoded)", () => {
          instance.defaultAlbumName = "has a space";
          expect(instance.getExternalLink(index)).toBe(
            `${instance.lastfmPrefix}/${
              instance.defaultArtistName
            }/${encodeURIComponent(instance.defaultAlbumName)}`
          );
        });
      });
    });

    describe("getPlayCount", () => {
      const mockPlayCount = "100";

      describe("when the playCount is defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].playcount = mockPlayCount;
          arrange();
        });

        it("should return the playCount", () => {
          expect(instance.getPlayCount(index)).toBe(mockPlayCount);
        });
      });

      describe("when the playCount is NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.albums[0].playcount = undefined;
          arrange();
        });

        it("should return 0", () => {
          expect(instance.getPlayCount(index)).toBe("0");
        });
      });
    });
  });

  describe("with an INVALID album index value", () => {
    beforeEach(() => (index = 1));

    describe("with a VALID size", () => {
      beforeEach(() => (size = "large"));

      describe("getArtwork", () => {
        beforeEach(() => arrange());

        it("should return an empty string", () => {
          expect(instance.getArtwork(index, size)).toBe("");
        });
      });
    });

    describe("with a INVALID size", () => {
      beforeEach(
        () => (size = "not-a-valid_size" as LastFMImageDataInterface["size"])
      );

      describe("getArtwork", () => {
        beforeEach(() => arrange());

        it("should return an empty string", () => {
          expect(instance.getArtwork(index, size)).toBe("");
        });
      });
    });

    describe("getName", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the default name", () => {
        expect(instance.getName(index)).toBe(instance.defaultAlbumName);
      });
    });

    describe("getRelatedArtistName", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the default name", () => {
        expect(instance.getRelatedArtistName(index)).toBe(
          instance.defaultArtistName
        );
      });
    });

    describe("getExternalLink", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the default name (url encoded)", () => {
        instance.defaultAlbumName = "has a space";
        expect(instance.getExternalLink(index)).toBe(
          `${instance.lastfmPrefix}/${
            instance.defaultArtistName
          }/${encodeURIComponent(instance.defaultAlbumName)}`
        );
      });
    });

    describe("getPlayCount", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return 0", () => {
        expect(instance.getPlayCount(index)).toBe("0");
      });
    });
  });
});
