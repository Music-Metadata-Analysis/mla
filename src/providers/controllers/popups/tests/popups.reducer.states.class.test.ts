import { InitialState } from "../popups.initial";
import PopUpsControllerReducerStates from "../popups.reducer.states.class";
import type { PopUpsControllerActionType } from "@src/types/controllers/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/types/controllers/popups/popups.state.types";

describe("UserReducerStates", () => {
  let reducerStates: PopUpsControllerReducerStates;
  let received: PopUpsControllerStateInterface;

  beforeEach(() => {
    reducerStates = new PopUpsControllerReducerStates();
  });

  const getInitialState = () =>
    JSON.parse(JSON.stringify(InitialState)) as PopUpsControllerStateInterface;

  const arrange = (
    action: PopUpsControllerActionType,
    state = getInitialState()
  ) => {
    return reducerStates[action.type](state, action);
  };

  const arrangeError = (testType: PopUpsControllerActionType["type"]) => {
    return () =>
      reducerStates[testType]({ ...InitialState }, {
        type: "InvalidAction",
      } as never as PopUpsControllerActionType);
  };

  describe("HidePopUp", () => {
    const testType = "HidePopUp" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: "HidePopUp",
        name: "FeedBack",
      });
      expect(received).toStrictEqual({
        ...getInitialState(),
        FeedBack: { status: false },
      });
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("ShowPopUp", () => {
    const testType = "ShowPopUp" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: "ShowPopUp",
        name: "FeedBack",
      });
      expect(received).toStrictEqual({
        ...getInitialState(),
        FeedBack: { status: true },
      });
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });
});
