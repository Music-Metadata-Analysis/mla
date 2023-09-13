import ReducerState from "../datapoint.timeout.class";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

const testType = "DataPointTimeoutFetch";
type actionType = ReportActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let mockRetries: number;
  let received: ReportStateInterface;
  const testIntegrationType = "TEST";
  const testUserName = "testUserName";
  const testState = {
    data: {
      integration: testIntegrationType,
      report: {},
    },
    userName: testUserName,
    profileUrl: "mockProfile",
  } as ReportStateInterface;

  const arrange = (state: ReportStateInterface, action: actionType) => {
    stateClass = new ReducerState(state, action);
    received = stateClass.apply();
  };

  describe("When Initialized", () => {
    const getInitialState = () => JSON.parse(JSON.stringify(testState));

    describe("apply", () => {
      describe("with a matching action", () => {
        describe("with positive retries remaining", () => {
          beforeEach(() => {
            mockRetries = 3;
            action = {
              type: testType,
            };
            arrange({ ...getInitialState(), retries: mockRetries }, action);
          });

          it("should return the the expected state", () => {
            expect(received.inProgress).toBe(false);
            expect(received.profileUrl).toBe(testState.profileUrl);
            expect(received.userName).toBe(testState.userName);
            expect(received.data).toStrictEqual({
              integration: testState.data.integration,
              report: testState.data.report,
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
            };
            arrange({ ...getInitialState(), retries: mockRetries }, action);
          });

          it("should return the the expected state", () => {
            expect(received.inProgress).toBe(false);
            expect(received.profileUrl).toBe(testState.profileUrl);
            expect(received.userName).toBe(testState.userName);
            expect(received.data).toStrictEqual({
              integration: testState.data.integration,
              report: testState.data.report,
            });
            expect(received.error).toBe("DataPointFailureFetch");
            expect(received.ready).toBe(false);
            expect(received.retries).toBe(mockRetries);
          });
        });
      });

      describe("with a NON matching action", () => {
        beforeEach(() => {
          action = {
            type: "UnknownType",
          } as unknown as actionType;
          arrange(testState, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual(testState);
        });
      });
    });
  });
});
