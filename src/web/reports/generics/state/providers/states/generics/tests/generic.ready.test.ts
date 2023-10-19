import ReducerState from "../generic.ready.class";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

const testType = "ReadyFetch";
type actionType = ReportActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let received: ReportStateInterface;

  const testIntegrationType = "TEST";
  const testUserName = "testUserName";

  const initialState = {
    data: {
      integration: testIntegrationType,
      report: {},
    },
    profileUrl: `https://www.last.fm/user/${testUserName}`,
    retries: 2,
    userName: testUserName,
  } as ReportStateInterface;

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
          arrange(initialState, action);
        });

        it("should return the correct state", () => {
          expect(received.inProgress).toBe(false);
          expect(received.profileUrl).toBe(initialState.profileUrl);
          expect(received.userName).toBe(testUserName);
          expect(received.data).toStrictEqual(initialState.data);
          expect(received.error).toBe(null);
          expect(received.ready).toBe(true);
          expect(received.retries).toBe(stateClass.initialRetries);
        });
      });

      describe("with a NON matching action", () => {
        beforeEach(() => {
          action = {
            type: "UnknownType",
          } as unknown as actionType;
          arrange(initialState, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual(initialState);
        });
      });
    });
  });
});
