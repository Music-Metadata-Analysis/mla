import ReducerState from "../cache.success.create.class";
import stateFixture from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.complete.1.json";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

const testType = "SuccessCreateCachedReport";
type actionType = ReportActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let received: ReportStateInterface;

  const completeReport = {
    ...stateFixture,
    inProgress: true,
    ready: false,
  };

  const arrange = (state: ReportStateInterface, action: actionType) => {
    stateClass = new ReducerState(state, action);
    received = stateClass.apply();
  };

  describe("When Initialized", () => {
    describe("apply", () => {
      describe("with a matching action", () => {
        beforeEach(() => {
          action = {
            type: testType,
          };
          arrange(completeReport, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual({
            ...completeReport,
            inProgress: false,
          });
        });
      });

      describe("with a NON matching action", () => {
        beforeEach(() => {
          action = {
            type: "UnknownType",
          } as unknown as actionType;
          arrange(completeReport, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual(completeReport);
        });
      });
    });
  });
});
