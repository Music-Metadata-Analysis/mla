import ReducerState from "../generic.success.class";
import { mockAlbumsReport } from "@src/web/reports/generics/state/providers/tests/fixtures/report.state.data";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

const testType = "SuccessFetch";
type actionType = ReportActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let received: ReportStateInterface;

  const initialState = {
    retries: 2,
  } as ReportStateInterface;

  const testIntegrationType = "TEST";
  const testUserName = "testUserName";
  const testType = "SuccessFetch";
  const testProfile = "http://test.profile.com/image.jpg";

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
            data: mockAlbumsReport,
            integration: testIntegrationType,
            userName: testUserName,
            userProfile: testProfile,
          };
          arrange(initialState, action);
        });

        it("should return the correct state", () => {
          expect(received.inProgress).toBe(false);
          expect(received.profileUrl).toBe(testProfile);
          expect(received.userName).toBe(testUserName);
          expect(received.data).toStrictEqual({
            integration: testIntegrationType,
            report: mockAlbumsReport,
          });
          expect(received.error).toBe(null);
          expect(received.ready).toBe(false);
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
