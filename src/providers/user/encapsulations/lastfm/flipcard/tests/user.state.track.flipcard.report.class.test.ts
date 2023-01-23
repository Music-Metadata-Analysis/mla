import { baseUserProperties } from "../../tests/states/user.state.data.set";
import UserTrackState from "../user.state.track.flipcard.report.class";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import type {
  LastFMUserArtistInterface,
  LastFMUserTrackInterface,
} from "@src/types/clients/api/lastfm/response.types";
import type { LastFMUserStateTrackReport } from "@src/types/user/state.types";

describe("UserTrackState", () => {
  let currentState: LastFMUserStateTrackReport;
  let instance: UserTrackState;
  const mockT = new MockUseTranslation("lastfm").t;
  let index: number;

  const resetState = () => {
    currentState = JSON.parse(JSON.stringify(baseUserProperties));
  };

  const arrange = () => {
    instance = new UserTrackState(currentState, mockT);
  };

  beforeEach(() => {
    resetState();
  });

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("getDataSource", () => {
      let data: LastFMUserTrackInterface[];

      beforeEach(() => {
        data = instance.getDataSource();
      });

      it("should return the correct data", () => {
        expect(data).toBe(instance.userProperties.data.report.tracks);
      });
    });
  });

  describe("with a VALID album index value", () => {
    beforeEach(() => (index = 0));

    describe("getDrawerEvent", () => {
      const mockTrackName = "mockTrackName";
      const mockArtistName = "mockArtistName";

      describe("when a track name and artist name are defined", () => {
        beforeEach(() => {
          currentState.data.report.tracks[0].name = mockTrackName;
          (
            currentState.data.report.tracks[0]
              .artist as LastFMUserArtistInterface
          ).name = mockArtistName;
          arrange();
        });

        it("should return the correct event", () => {
          expect(instance.getDrawerEvent(index)).toEqual({
            category: "LAST.FM",
            label: "DATA: TRACK",
            action: `VIEWED TRACK DETAILS: ${mockArtistName}:${mockTrackName}.`,
            value: undefined,
          });
        });
      });

      describe("when a track name and artist name are NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.tracks[0].name = undefined;
          (
            currentState.data.report.tracks[0]
              .artist as LastFMUserArtistInterface
          ).name = undefined;
          arrange();
        });

        it("should return the correct event", () => {
          expect(instance.getDrawerEvent(index)).toEqual({
            category: "LAST.FM",
            label: "DATA: TRACK",
            action: `VIEWED TRACK DETAILS: ${instance.defaultArtistName}:${instance.defaultTrackName}.`,
            value: undefined,
          });
        });
      });
    });

    describe("getDrawerTitle", () => {
      const mockTrackName = "mockTrackName";
      const mockArtistName = "mockArtistName";

      describe("when a track name and artist name are defined", () => {
        beforeEach(() => {
          currentState.data.report.tracks[0].name = mockTrackName;
          (
            currentState.data.report.tracks[0]
              .artist as LastFMUserArtistInterface
          ).name = mockArtistName;
          arrange();
        });

        it("should return the correct title", () => {
          expect(instance.getDrawerTitle(index)).toBe(
            `${mockArtistName}: ${mockTrackName}`
          );
        });
      });

      describe("when a track name and artist name are NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.tracks[0].name = undefined;
          (
            currentState.data.report.tracks[0]
              .artist as LastFMUserArtistInterface
          ).name = undefined;
          arrange();
        });

        it("should return the default title", () => {
          expect(instance.getDrawerTitle(index)).toBe(
            `${instance.defaultArtistName}: ${instance.defaultTrackName}`
          );
        });
      });
    });

    describe("getRelatedArtistName", () => {
      const mockTrackName = "mockTrackName";

      describe("when an artist name is defined", () => {
        beforeEach(() => {
          (
            currentState.data.report.tracks[0]
              .artist as LastFMUserArtistInterface
          ).name = mockTrackName;
          arrange();
        });

        it("should return the name", () => {
          expect(instance.getRelatedArtistName(index)).toBe(mockTrackName);
        });
      });

      describe("when an artist name is NOT defined", () => {
        beforeEach(() => {
          (
            currentState.data.report.tracks[0]
              .artist as LastFMUserArtistInterface
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

      describe("when the track link is defined", () => {
        beforeEach(() => {
          currentState.data.report.tracks[0].url = mockUrl;
          arrange();
        });

        it("should return the name", () => {
          expect(instance.getExternalLink(index)).toBe(mockUrl);
        });
      });

      describe("when the track link is NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.tracks[0].url = undefined;
          arrange();
        });

        it("should return the default name (url encoded)", () => {
          instance.defaultTrackName = "has a space";
          expect(instance.getExternalLink(index)).toBe(
            `${instance.lastfmPrefix}/${encodeURIComponent(
              instance.defaultArtistName
            )}/_/${encodeURIComponent(instance.defaultTrackName)}`
          );
        });
      });
    });
  });

  describe("with an INVALID album index value", () => {
    beforeEach(() => (index = 1));

    describe("getDrawerEvent", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the correct event", () => {
        expect(instance.getDrawerEvent(index)).toEqual({
          category: "LAST.FM",
          label: "DATA: TRACK",
          action: `VIEWED TRACK DETAILS: ${instance.defaultArtistName}:${instance.defaultTrackName}.`,
          value: undefined,
        });
      });
    });

    describe("getDrawerTitle", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the default title", () => {
        expect(instance.getDrawerTitle(index)).toBe(
          `${instance.defaultArtistName}: ${instance.defaultTrackName}`
        );
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
        instance.defaultTrackName = "has a space";
        expect(instance.getExternalLink(index)).toBe(
          `${instance.lastfmPrefix}/${encodeURIComponent(
            instance.defaultArtistName
          )}/_/${encodeURIComponent(instance.defaultTrackName)}`
        );
      });
    });
  });
});
