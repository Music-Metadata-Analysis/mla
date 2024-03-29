import ReducerState from "../generic.start.class";
import { mockInitialReportData } from "@src/web/reports/generics/state/providers/tests/fixtures/report.state.data";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

const testType = "StartFetch";
type actionType = ReportActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let received: ReportStateInterface;
  const emptyState = { retries: 3 } as ReportStateInterface;
  const testIntegrationType = "TEST";
  const testUserName = "testUserName";

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
            userName: testUserName,
            integration: testIntegrationType,
          };
          arrange(emptyState, action);
        });

        it("should return the correct state", () => {
          expect(received.inProgress).toBe(true);
          expect(received.userName).toBe(testUserName);
          expect(received.data).toStrictEqual({
            integration: testIntegrationType,
            report: mockInitialReportData,
          });
          expect(received.error).toBe(null);
          expect(received.profileUrl).toBe(null);
          expect(received.ready).toBe(false);
          expect(received.retries).toBe(stateClass.initialRetries);
        });
      });

      describe("with a NON matching action", () => {
        beforeEach(() => {
          action = {
            type: "UnknownType",
          } as unknown as actionType;
          arrange(emptyState, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual(emptyState);
        });
      });
    });
  });
});
