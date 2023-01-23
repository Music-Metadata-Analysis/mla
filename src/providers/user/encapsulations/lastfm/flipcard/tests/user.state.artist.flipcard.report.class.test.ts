import { baseUserProperties } from "../../tests/states/user.state.data.set";
import UserArtistState from "../user.state.artist.flipcard.report.class";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import type { LastFMUserArtistInterface } from "@src/types/clients/api/lastfm/response.types";
import type { LastFMUserStateArtistReport } from "@src/types/user/state.types";

describe("UserArtistState", () => {
  let currentState: LastFMUserStateArtistReport;
  let instance: UserArtistState;
  const mockT = new MockUseTranslation("lastfm").t;
  let index: number;

  const resetState = () => {
    currentState = JSON.parse(JSON.stringify(baseUserProperties));
  };

  const arrange = () => {
    instance = new UserArtistState(currentState, mockT);
  };

  beforeEach(() => {
    resetState();
  });

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("getDataSource", () => {
      let data: LastFMUserArtistInterface[];

      beforeEach(() => {
        data = instance.getDataSource();
      });

      it("should return the correct data", () => {
        expect(data).toBe(instance.userProperties.data.report.artists);
      });
    });
  });

  describe("with a VALID artist index value", () => {
    beforeEach(() => (index = 0));

    describe("getDrawerEvent", () => {
      const mockArtistName = "mockArtistName";

      describe("when an artist name is defined", () => {
        beforeEach(() => {
          currentState.data.report.artists[0].name = mockArtistName;
          arrange();
        });

        it("should return the correct event", () => {
          expect(instance.getDrawerEvent(index)).toEqual({
            category: "LAST.FM",
            label: "DATA: ARTIST",
            action: `VIEWED ARTIST DETAILS: ${mockArtistName}.`,
            value: undefined,
          });
        });
      });

      describe("when an artist name is NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.artists[0].name = undefined;
          arrange();
        });

        it("should return the correct event", () => {
          expect(instance.getDrawerEvent(index)).toEqual({
            category: "LAST.FM",
            label: "DATA: ARTIST",
            action: `VIEWED ARTIST DETAILS: ${instance.defaultArtistName}.`,
            value: undefined,
          });
        });
      });
    });

    describe("getDrawerTitle", () => {
      const mockArtistName = "mockArtistName";

      describe("when an artist name is defined", () => {
        beforeEach(() => {
          currentState.data.report.artists[0].name = mockArtistName;
          arrange();
        });

        it("should return the correct title", () => {
          expect(instance.getDrawerTitle(index)).toBe(`${mockArtistName}`);
        });
      });

      describe("when an artist name is NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.artists[0].name = undefined;
          arrange();
        });

        it("should return the default title", () => {
          expect(instance.getDrawerTitle(index)).toBe(
            `${instance.defaultArtistName}`
          );
        });
      });
    });

    describe("getExternalLink", () => {
      const mockUrl = "http://some.com/url";

      describe("when the artist link is defined", () => {
        beforeEach(() => {
          currentState.data.report.artists[0].url = mockUrl;
          arrange();
        });

        it("should return the url", () => {
          expect(instance.getExternalLink(index)).toBe(mockUrl);
        });
      });

      describe("when the artist link is NOT defined", () => {
        beforeEach(() => {
          currentState.data.report.artists[0].url = undefined;
          arrange();
        });

        it("should return the default name (url encoded)", () => {
          instance.defaultArtistName = "has a space";
          expect(instance.getExternalLink(index)).toBe(
            `${instance.lastfmPrefix}/${encodeURIComponent(
              instance.defaultArtistName
            )}`
          );
        });
      });
    });
  });

  describe("with an INVALID artist index value", () => {
    beforeEach(() => (index = 1));

    describe("getDrawerEvent", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the correct event", () => {
        expect(instance.getDrawerEvent(index)).toEqual({
          category: "LAST.FM",
          label: "DATA: ARTIST",
          action: `VIEWED ARTIST DETAILS: ${instance.defaultArtistName}.`,
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
          `${instance.defaultArtistName}`
        );
      });
    });

    describe("getExternalLink", () => {
      beforeEach(() => {
        arrange();
      });

      it("should return the default name (url encoded)", () => {
        instance.defaultArtistName = "has a space";
        expect(instance.getExternalLink(index)).toBe(
          `${instance.lastfmPrefix}/${encodeURIComponent(
            instance.defaultArtistName
          )}`
        );
      });
    });
  });
});
