import ConcreteBaseReportState from "./implementations/concrete.user.state.flipcard.report.class";
import {
  baseUserProperties,
  mockUrls,
} from "../../tests/states/user.state.data.set";
import lastfmTranslations from "@locales/lastfm.json";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import type UserFlipCardBaseReportState from "../user.state.base.flipcard.report.class";
import type { LastFMUserStateAlbumReport } from "@src/types/user/state.types";
import type { LastFMImageDataInterface } from "@src/web/api/lastfm/types/response.types";

describe("UserFlipCardBaseReportState", () => {
  let currentState: LastFMUserStateAlbumReport;
  let instance: UserFlipCardBaseReportState;
  const mockT = new MockUseTranslation("lastfm").t;
  let index: number;
  let size: LastFMImageDataInterface["size"];

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
      expect(instance.defaultAlbumName).toBe(
        _t(lastfmTranslations.defaults.albumName)
      );
      expect(instance.defaultArtistName).toBe(
        _t(lastfmTranslations.defaults.artistName)
      );
      expect(instance.defaultTrackName).toBe(
        _t(lastfmTranslations.defaults.trackName)
      );
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
