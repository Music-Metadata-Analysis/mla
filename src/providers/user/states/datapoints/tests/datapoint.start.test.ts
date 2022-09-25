import ReducerState from "../datapoint.start.class";
import type { UserActionType } from "@src/types/user/action.types";
import type { UserStateInterface } from "@src/types/user/state.types";

const testType = "DataPointStartFetch";
type actionType = UserActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let received: UserStateInterface;
  const testIntegrationType = "TEST";
  const testUserName = "testUserName";
  const testState = {
    data: { integration: testIntegrationType },
    userName: testUserName,
    profileUrl: "mockProfile",
  } as UserStateInterface;

  const arrange = (state: UserStateInterface, action: actionType) => {
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
          arrange(testState, action);
        });

        it("should return the correct state", () => {
          expect(received.inProgress).toBe(true);
          expect(received.profileUrl).toBe(testState.profileUrl);
          expect(received.userName).toBe(testState.userName);
          expect(received.data).toStrictEqual(testState.data);
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
          arrange(testState, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual(testState);
        });
      });
    });
  });
});
