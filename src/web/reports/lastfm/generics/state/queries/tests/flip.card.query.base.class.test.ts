import {
  MockReportClass,
  MockUserStateEncapsulation,
} from "./implementations/concrete.last.fm.query.class";
import FlipCardBaseReport from "../flip.card.query.base.class";
import mockImageController from "@src/hooks/controllers/__mocks__/images.controller.hook.mock";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/web/api/lastfm/types/response.types";

describe(FlipCardBaseReport.name, () => {
  let instance: FlipCardBaseReport<
    MockUserStateEncapsulation,
    LastFMTopAlbumsReportResponseInterface["albums"]
  >;

  let mockUserState: MockUserStateEncapsulation["userProperties"];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserState = JSON.parse(JSON.stringify(InitialState));
    mockUserState.data.report.albums = [];
  });

  const arrange = () => (instance = new MockReportClass());

  describe("when initialized with a concrete implementation", () => {
    beforeEach(() => arrange());

    describe("drawerArtWorkAltTextTranslationKey", () => {
      let result: string;

      beforeEach(
        () => (result = instance.getDrawerArtWorkAltTextTranslationKey())
      );

      it("should return the correct result", () => {
        expect(result).toBe("top20Albums.drawer.artWorkAltText");
      });
    });

    describe("queryIsImagesLoaded", () => {
      let result: boolean;

      describe("when the images are all loaded", () => {
        beforeEach(() => {
          const controller = { ...mockImageController };
          controller.count = 4;
          mockUserState.data.report.albums = [{ name: "one" }, { name: "two" }];

          result = instance.queryIsImagesLoaded(mockUserState, controller);
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });

      describe("when the images are NOT all loaded", () => {
        beforeEach(() => {
          const controller = { ...mockImageController };
          controller.count = 0;
          mockUserState.data.report.albums = [{ name: "one" }, { name: "two" }];

          result = instance.queryIsImagesLoaded(mockUserState, controller);
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });

    describe("queryUserHasNoData", () => {
      let result: boolean;

      describe("when the report is ready", () => {
        beforeEach(() => (mockUserState.ready = true));

        describe("when the report has a username", () => {
          beforeEach(() => (mockUserState.userName = "mockUser"));

          describe("when the report has user data", () => {
            beforeEach(() => {
              mockUserState.data.report.albums = [
                { name: "one" },
                { name: "two" },
              ];

              result = instance.queryUserHasNoData(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has NO user data", () => {
            beforeEach(() => {
              mockUserState.data.report.albums = [];

              result = instance.queryUserHasNoData(mockUserState);
            });

            it("should return true", () => {
              expect(result).toBe(true);
            });
          });
        });

        describe("when the report does NOT have a username", () => {
          beforeEach(() => (mockUserState.userName = null));

          describe("when the report has user data", () => {
            beforeEach(() => {
              mockUserState.data.report.albums = [
                { name: "one" },
                { name: "two" },
              ];

              result = instance.queryUserHasNoData(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has NO user data", () => {
            beforeEach(() => {
              mockUserState.data.report.albums = [];

              result = instance.queryUserHasNoData(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });
      });

      describe("when the report is NOT ready", () => {
        beforeEach(() => (mockUserState.ready = false));

        describe("when the report has a username", () => {
          beforeEach(() => (mockUserState.userName = "mockUser"));

          describe("when the report has user data", () => {
            beforeEach(() => {
              mockUserState.data.report.albums = [
                { name: "one" },
                { name: "two" },
              ];

              result = instance.queryUserHasNoData(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has NO user data", () => {
            beforeEach(() => {
              mockUserState.data.report.albums = [];

              result = instance.queryUserHasNoData(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });

        describe("when the report does NOT have a username", () => {
          beforeEach(() => (mockUserState.userName = null));

          describe("when the report has user data", () => {
            beforeEach(() => {
              mockUserState.data.report.albums = [
                { name: "one" },
                { name: "two" },
              ];

              result = instance.queryUserHasNoData(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has NO user data", () => {
            beforeEach(() => {
              mockUserState.data.report.albums = [];

              result = instance.queryUserHasNoData(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });
      });
    });
  });
});
