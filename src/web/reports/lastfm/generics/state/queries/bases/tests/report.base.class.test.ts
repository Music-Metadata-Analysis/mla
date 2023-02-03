import {
  MockBaseReportClass,
  MockDrawerComponent,
  MockUserStateEncapsulation,
} from "./implementations/concrete.query.class";
import LastFMReportQueryAbstractBaseClass from "../query.base.class";
import routes from "@src/config/routes";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import mockLastFmHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import type { userHookAsLastFM } from "@src/types/user/hook.types";
import type UserState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/user.state.base.class";
import type { FC } from "react";

describe(LastFMReportQueryAbstractBaseClass.name, () => {
  let instance: LastFMReportQueryAbstractBaseClass<
    UserState,
    UserState["userProperties"],
    Record<string, never>
  >;

  let mockUserState: MockUserStateEncapsulation["userProperties"];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserState = JSON.parse(JSON.stringify(InitialState));
    mockUserState.data.report.albums = [];
  });

  const arrange = () => (instance = new MockBaseReportClass());

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
      let result: MockUserStateEncapsulation;

      describe("when translations are needed", () => {
        const mockT = jest.fn();

        beforeEach(
          () =>
            (result = instance.getEncapsulatedReportState(mockUserState, mockT))
        );

        it("should return the correct result", () => {
          expect(result).toBeInstanceOf(MockUserStateEncapsulation);
          expect(JSON.parse(JSON.stringify(result))).toStrictEqual(
            JSON.parse(
              JSON.stringify(
                new MockUserStateEncapsulation(mockUserState, mockT)
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
          () => (result = instance.getEncapsulatedReportState(mockUserState))
        );

        it("should return the correct result", () => {
          expect(result).toBeInstanceOf(MockUserStateEncapsulation);
          expect(JSON.parse(JSON.stringify(result))).toStrictEqual(
            JSON.parse(
              JSON.stringify(new MockUserStateEncapsulation(mockUserState))
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
        beforeEach(() => (mockUserState.inProgress = true));

        describe("when the report is ready", () => {
          beforeEach(() => (mockUserState.ready = true));

          describe("when the report has no error", () => {
            beforeEach(() => {
              mockUserState.error = null;

              result = instance.queryIsDataReady(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has an error", () => {
            beforeEach(() => {
              mockUserState.error = "DataPointFailureFetch";

              result = instance.queryIsDataReady(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });

        describe("when the report is NOT ready", () => {
          beforeEach(() => (mockUserState.ready = false));

          describe("when the report has no error", () => {
            beforeEach(() => {
              mockUserState.error = null;

              result = instance.queryIsDataReady(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has an error", () => {
            beforeEach(() => {
              mockUserState.error = "DataPointFailureFetch";

              result = instance.queryIsDataReady(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });
      });

      describe("when the report is NOT in progress", () => {
        beforeEach(() => (mockUserState.inProgress = false));

        describe("when the report is ready", () => {
          beforeEach(() => (mockUserState.ready = true));

          describe("when the report has no error", () => {
            beforeEach(() => {
              mockUserState.error = null;

              result = instance.queryIsDataReady(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });

          describe("when the report has an error", () => {
            beforeEach(() => {
              mockUserState.error = "DataPointFailureFetch";

              result = instance.queryIsDataReady(mockUserState);
            });

            it("should return false", () => {
              expect(result).toBe(false);
            });
          });
        });

        describe("when the report is NOT ready", () => {
          beforeEach(() => (mockUserState.ready = false));

          describe("when the report has no error", () => {
            beforeEach(() => {
              mockUserState.error = null;

              result = instance.queryIsDataReady(mockUserState);
            });

            it("should return true", () => {
              expect(result).toBe(true);
            });
          });

          describe("when the report has an error", () => {
            beforeEach(() => {
              mockUserState.error = "DataPointFailureFetch";

              result = instance.queryIsDataReady(mockUserState);
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
        const test = () => instance.queryUserHasNoData(mockUserState);
        expect(test).toThrowError("Method not implemented.");
      });
    });

    describe("startDataFetch", () => {
      const mockUserName = "mockUserName";

      beforeEach(() =>
        instance.startDataFetch(
          mockLastFmHook as userHookAsLastFM,
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
