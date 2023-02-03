import ReducerState from "../generic.timeout.class";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import { mockInitialReportData } from "@src/web/reports/generics/state/providers/tests/fixtures/report.state.data";
import type { UserActionType } from "@src/types/user/action.types";
import type { UserStateInterface } from "@src/types/user/state.types";

const testType = "TimeoutFetch";
type actionType = UserActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let mockRetries: number;
  let received: UserStateInterface;
  const emptyState = {} as UserStateInterface;
  const testIntegrationType = "TEST";
  const testUserName = "testUserName";

  const arrange = (state: UserStateInterface, action: actionType) => {
    stateClass = new ReducerState(state, action);
    received = stateClass.apply();
  };

  describe("When Initialized", () => {
    const getInitialState = () => JSON.parse(JSON.stringify(InitialState));

    describe("apply", () => {
      describe("with a matching action", () => {
        describe("with positive retries remaining", () => {
          beforeEach(() => {
            mockRetries = 3;
            action = {
              type: testType,
              userName: testUserName,
              integration: testIntegrationType,
            };
            arrange({ ...getInitialState(), retries: mockRetries }, action);
          });

          it("should return the the expected state", () => {
            expect(received.inProgress).toBe(false);
            expect(received.profileUrl).toBe(null);
            expect(received.userName).toBe(testUserName);
            expect(received.data).toStrictEqual({
              integration: testIntegrationType,
              report: mockInitialReportData,
            });
            expect(received.error).toBe(testType);
            expect(received.ready).toBe(false);
            expect(received.retries).toBe(mockRetries - 1);
          });
        });

        describe("with no retries remaining", () => {
          beforeEach(() => {
            mockRetries = 0;
            action = {
              type: testType,
              userName: testUserName,
              integration: testIntegrationType,
            };
            arrange({ ...getInitialState(), retries: mockRetries }, action);
          });

          it("should return the the expected state", () => {
            expect(received.inProgress).toBe(false);
            expect(received.profileUrl).toBe(null);
            expect(received.userName).toBe(testUserName);
            expect(received.data).toStrictEqual({
              integration: testIntegrationType,
              report: mockInitialReportData,
            });
            expect(received.error).toBe("FailureFetch");
            expect(received.ready).toBe(true);
            expect(received.retries).toBe(mockRetries);
          });
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
