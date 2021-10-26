import EventDefinition from "../../../../../events/event.class";
import UserBaseReportState from "../user.state.base.report.class";
import type { LastFMImageDataInterface } from "../../../../../types/integrations/lastfm/api.types";
import type { LastFMUserStateAlbumReport } from "../../../../../types/user/state.types";
import type { UserStateInterface } from "../../../../../types/user/state.types";

class ConcreteBaseReportState extends UserBaseReportState {
  getDataSource = () => this.userProperties.data.report.albums as unknown[];

  getDefaultEntityName = () => {
    return this.defaultAlbumName;
  };

  getDrawerTitle = (index: number) => {
    return `Mock Title: ${this.getName(index)}`;
  };

  getExternalLink = (index: number) => {
    return `Mock Url: ${this.getName(index)}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDrawerEvent = (index: number) =>
    new EventDefinition({
      category: "LAST.FM",
      label: "TEST",
      action: "TEST",
    });
}

describe("UserBaseReportState", () => {
  let currentState: LastFMUserStateAlbumReport;
  let instance: UserBaseReportState;
  const mockT = jest.fn((arg: string) => `t(${arg})`);
  let index: number;
  let size: LastFMImageDataInterface["size"];
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
    retries: 3,
    userName: null,
  };

  const resetState = () => {
    currentState = JSON.parse(JSON.stringify(baseUserProperties));
  };

  const arrange = () => {
    instance = new ConcreteBaseReportState(currentState, mockT);
  };

  beforeEach(() => {
    resetState();
  });

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should have the correct translated default values", () => {
      expect(instance.defaultAlbumName).toBe("t(defaults.albumName)");
      expect(instance.defaultArtistName).toBe("t(defaults.artistName)");
      expect(instance.defaultTrackName).toBe("t(defaults.trackName)");
    });

    describe("getDataSource", () => {
      let data: unknown[];

      beforeEach(() => {
        data = instance.getDataSource();
      });

      it("should return the correct data", () => {
        expect(data).toBe(instance.userProperties.data.report.albums);
      });
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
