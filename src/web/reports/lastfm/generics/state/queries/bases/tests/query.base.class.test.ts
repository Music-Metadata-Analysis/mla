import {
  MockBaseQueryClass,
  MockDrawerComponent,
  MockReportStateEncapsulation,
} from "./implementations/concrete.query.class";
import LastFMReportQueryAbstractBaseClass from "../query.base.class";
import routes from "@src/config/routes";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import mockLastFmHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import type LastFMReportBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/bases/lastfm.report.encapsulation.base.class";
import type { reportHookAsLastFM } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";
import type { FC } from "react";

describe(LastFMReportQueryAbstractBaseClass.name, () => {
  let instance: LastFMReportQueryAbstractBaseClass<
    LastFMReportBaseStateEncapsulation,
    LastFMReportBaseStateEncapsulation["reportProperties"],
    Record<string, never>
  >;

  let mockReportState: MockReportStateEncapsulation["reportProperties"];

  beforeEach(() => {
    jest.clearAllMocks();

    mockReportState = JSON.parse(JSON.stringify(InitialState));
    mockReportState.data.report.albums = [];
  });

  const arrange = () => (instance = new MockBaseQueryClass());

  describe("when initialized with a concrete implementation", () => {
    beforeEach(() => arrange());

    describe("getAnalyticsReportType", () => {
      let result: string;

      beforeEach(() => (result = instance.getAnalyticsReportType()));

      it("should return the correct result", () => {
        expect(result).toBe("TOP20 ALBUMS");
      });
    });

    describe("getDrawerComponent", () => {
      let result: FC<Record<string, never>>;

      beforeEach(() => (result = instance.getDrawerComponent()));

      it("should return the correct result", () => {
        expect(result).toBe(MockDrawerComponent);
      });
    });

    describe("getEncapsulatedReportState", () => {
      let result: MockReportStateEncapsulation;

      describe("when translations are needed", () => {
        const mockT = jest.fn();

        beforeEach(
          () =>
            (result = instance.getEncapsulatedReportState(
              mockReportState,
              mockT
            ))
        );

        it("should return the correct result", () => {
          expect(result).toBeInstanceOf(MockReportStateEncapsulation);
          expect(JSON.parse(JSON.stringify(result))).toStrictEqual(
            JSON.parse(
              JSON.stringify(
                new MockReportStateEncapsulation(mockReportState, mockT)
              )
            )
          );
        });

        it("should contain the translation function", () => {
          expect(result.t).toBe(mockT);
        });
      });

      describe("when translations are not needed", () => {
        beforeEach(
          () => (result = instance.getEncapsulatedReportState(mockReportState))
        );

        it("should return the correct result", () => {
          expect(result).toBeInstanceOf(MockReportStateEncapsulation);
          expect(JSON.parse(JSON.stringify(result))).toStrictEqual(
            JSON.parse(
              JSON.stringify(new MockReportStateEncapsulation(mockReportState))
            )
          );
        });

        it("should NOT contain a translation function", () => {
          expect(result.t).toBeUndefined();
        });
      });
    });

    describe("getHookMethod", () => {
      let result: string;

      beforeEach(() => (result = instance.getHookMethod()));

      it("should return the correct result", () => {
        expect(result).toBe("top20albums");
      });
    });

    describe("getRetryRoute", () => {
      let result: string;

      beforeEach(() => (result = instance.getRetryRoute()));

      it("should return the correct result", () => {
        expect(result).toBe(routes.search.lastfm.top20albums);
      });
    });

    describe("getReportTranslationKey", () => {
      let result: string;

      beforeEach(() => (result = instance.getReportTranslationKey()));

      it("should return the correct result", () => {
        expect(result).toBe("top20Albums");
      });
    });

    describe("queryIsDataReady", () => {
      let result: boolean;

      describe("when the report is in progress", () => {
        beforeEach(() => (mockReportState.inProgress = true));

        describe("when the report is ready", () => {
          beforeEach(() => (mockReportState.ready = true));

          describe("when the report has no error", () => {
            beforeEach(() => {
              mockReportState.error = null;

              result = instance.queryIsDataReady(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has an error", () => {
            beforeEach(() => {
              mockReportState.error = "DataPointFailureFetch";

              result = instance.queryIsDataReady(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });

        describe("when the report is NOT ready", () => {
          beforeEach(() => (mockReportState.ready = false));

          describe("when the report has no error", () => {
            beforeEach(() => {
              mockReportState.error = null;

              result = instance.queryIsDataReady(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has an error", () => {
            beforeEach(() => {
              mockReportState.error = "DataPointFailureFetch";

              result = instance.queryIsDataReady(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });
      });

      describe("when the report is NOT in progress", () => {
        beforeEach(() => (mockReportState.inProgress = false));

        describe("when the report is ready", () => {
          beforeEach(() => (mockReportState.ready = true));

          describe("when the report has no error", () => {
            beforeEach(() => {
              mockReportState.error = null;

              result = instance.queryIsDataReady(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has an error", () => {
            beforeEach(() => {
              mockReportState.error = "DataPointFailureFetch";

              result = instance.queryIsDataReady(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });

        describe("when the report is NOT ready", () => {
          beforeEach(() => (mockReportState.ready = false));

          describe("when the report has no error", () => {
            beforeEach(() => {
              mockReportState.error = null;

              result = instance.queryIsDataReady(mockReportState);
            });

            it("should return true", () => {
              expect(result).toBe(true);
            });
          });

          describe("when the report has an error", () => {
            beforeEach(() => {
              mockReportState.error = "DataPointFailureFetch";

              result = instance.queryIsDataReady(mockReportState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });
      });
    });

    describe("queryUserHasNoData", () => {
      it("should raise an Not Implemented error", () => {
        const test = () => instance.queryUserHasNoData(mockReportState);
        expect(test).toThrowError("Method not implemented.");
      });
    });

    describe("startDataFetch", () => {
      const mockUserName = "mockUserName";

      beforeEach(() =>
        instance.startDataFetch(
          mockLastFmHook as reportHookAsLastFM,
          mockUserName
        )
      );

      it("should call the expected hook method", () => {
        expect(mockLastFmHook.top20albums).toBeCalledTimes(1);
        expect(mockLastFmHook.top20albums).toBeCalledWith(mockUserName);
      });
    });
  });
});
