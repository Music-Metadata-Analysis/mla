import ReducerState from "../cache.success.retrieve.class";
import stateFixture from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.complete.1.json";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

const testType = "SuccessRetrieveCachedReport";
type actionType = ReportActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let received: ReportStateInterface;

  const startState = {
    data: {
      integration: "mockIntegration",
      report: {},
    },
    error: null,
    inProgress: true,
    profileUrl: "mockProfileUrl",
    ready: false,
    retries: 3,
    userName: "mockUsername",
  } as ReportStateInterface;

  const mockCachedState = {
    ...stateFixture,
    retries: 1,
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
            cachedReportState: { ...mockCachedState },
          };
          arrange(startState, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual({
            ...mockCachedState,
            retries: startState.retries,
          });
        });
      });

      describe("with a NON matching action", () => {
        beforeEach(() => {
          action = {
            type: "UnknownType",
          } as unknown as actionType;
          arrange(startState, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual(startState);
        });
      });
    });
  });
});
