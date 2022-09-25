import { InitialState } from "../ui.popups.initial";
import UserInterfacePopUpsReducerStates from "../ui.popups.reducer.states.class";
import type { UserInterfacePopUpsActionType } from "@src/types/ui/popups/ui.popups.action.types";
import type { UserInterfacePopUpsStateInterface } from "@src/types/ui/popups/ui.popups.state.types";

describe("UserReducerStates", () => {
  let reducerStates: UserInterfacePopUpsReducerStates;
  let received: UserInterfacePopUpsStateInterface;

  beforeEach(() => {
    reducerStates = new UserInterfacePopUpsReducerStates();
  });

  const getInitialState = () =>
    JSON.parse(
      JSON.stringify(InitialState)
    ) as UserInterfacePopUpsStateInterface;

  const arrange = (
    action: UserInterfacePopUpsActionType,
    state = getInitialState()
  ) => {
    return reducerStates[action.type](state, action);
  };

  const arrangeError = (testType: UserInterfacePopUpsActionType["type"]) => {
    return () =>
      reducerStates[testType]({ ...InitialState }, {
        type: "InvalidAction",
      } as never as UserInterfacePopUpsActionType);
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
