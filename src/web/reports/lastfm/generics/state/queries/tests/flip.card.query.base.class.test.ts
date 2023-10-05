import {
  MockQueryClass,
  MockReportStateEncapsulation,
} from "./implementations/concrete.last.fm.query.class";
import FlipCardAbstractBaseQuery from "../flip.card.query.base.class";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import mockImageController from "@src/web/ui/images/state/controllers/__mocks__/images.controller.hook.mock";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";

describe(FlipCardAbstractBaseQuery.name, () => {
  let instance: FlipCardAbstractBaseQuery<
    MockReportStateEncapsulation,
    LastFMTopAlbumsReportResponseInterface["albums"]
  >;

  let mockReportState: MockReportStateEncapsulation["reportProperties"];

  beforeEach(() => {
    jest.clearAllMocks();

    mockReportState = JSON.parse(JSON.stringify(InitialState));
    mockReportState.data.report.albums = [];
  });

  const arrange = () => (instance = new MockQueryClass());

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
          mockReportState.data.report.albums = [
            { name: "one" },
            { name: "two" },
          ];

          result = instance.queryIsImagesLoaded(mockReportState, controller);
        });

        it("should return true", () => {
          expect(result).toBe(true);
        });
      });

      describe("when the images are NOT all loaded", () => {
        beforeEach(() => {
          const controller = { ...mockImageController };
          controller.count = 0;
          mockReportState.data.report.albums = [
            { name: "one" },
            { name: "two" },
          ];

          result = instance.queryIsImagesLoaded(mockReportState, controller);
        });

        it("should return false", () => {
          expect(result).toBe(false);
        });
      });
    });

    describe("queryUserHasNoData", () => {
      let result: boolean;

      describe("when the report is ready", () => {
        beforeEach(() => (mockReportState.ready = true));

        describe("when the report has a username", () => {
          beforeEach(() => (mockReportState.userName = "mockUser"));

          describe("when the report has user data", () => {
            beforeEach(() => {
              mockReportState.data.report.albums = [
                { name: "one" },
                { name: "two" },
              ];

              result = instance.queryUserHasNoData(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has NO user data", () => {
            beforeEach(() => {
              mockReportState.data.report.albums = [];

              result = instance.queryUserHasNoData(mockReportState);
            });

            it("should return true", () => {
              expect(result).toBe(true);
            });
          });
        });

        describe("when the report does NOT have a username", () => {
          beforeEach(() => (mockReportState.userName = null));

          describe("when the report has user data", () => {
            beforeEach(() => {
              mockReportState.data.report.albums = [
                { name: "one" },
                { name: "two" },
              ];

              result = instance.queryUserHasNoData(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has NO user data", () => {
            beforeEach(() => {
              mockReportState.data.report.albums = [];

              result = instance.queryUserHasNoData(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });
      });

      describe("when the report is NOT ready", () => {
        beforeEach(() => (mockReportState.ready = false));

        describe("when the report has a username", () => {
          beforeEach(() => (mockReportState.userName = "mockUser"));

          describe("when the report has user data", () => {
            beforeEach(() => {
              mockReportState.data.report.albums = [
                { name: "one" },
                { name: "two" },
              ];

              result = instance.queryUserHasNoData(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has NO user data", () => {
            beforeEach(() => {
              mockReportState.data.report.albums = [];

              result = instance.queryUserHasNoData(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });

        describe("when the report does NOT have a username", () => {
          beforeEach(() => (mockReportState.userName = null));

          describe("when the report has user data", () => {
            beforeEach(() => {
              mockReportState.data.report.albums = [
                { name: "one" },
                { name: "two" },
              ];

              result = instance.queryUserHasNoData(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has NO user data", () => {
            beforeEach(() => {
              mockReportState.data.report.albums = [];

              result = instance.queryUserHasNoData(mockReportState);
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
