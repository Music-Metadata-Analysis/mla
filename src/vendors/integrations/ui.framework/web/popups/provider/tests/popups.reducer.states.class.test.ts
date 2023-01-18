import PopUpsControllerReducerStates from "../popups.reducer.states.class";
import type { PopUpsControllerActionType } from "@src/vendors/types/integrations/ui.framework/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.state.types";

describe("UserReducerStates", () => {
  let reducerStates: PopUpsControllerReducerStates;
  let received: PopUpsControllerStateInterface;

  const mockInitialState = {
    MockPopUp: { status: false },
    FeedBack: { status: false },
  };

  beforeEach(() => {
    reducerStates = new PopUpsControllerReducerStates();
  });

  const getInitialState = () =>
    JSON.parse(
      JSON.stringify(mockInitialState)
    ) as PopUpsControllerStateInterface;

  const arrange = (
    action: PopUpsControllerActionType,
    state = getInitialState()
  ) => {
    return reducerStates[action.type](state, action);
  };

  const arrangeError = (testType: PopUpsControllerActionType["type"]) => {
    return () =>
      reducerStates[testType]({ ...mockInitialState }, {
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

  describe("RegisterPopUp", () => {
    const testType = "RegisterPopUp" as const;

    describe("when registering a new popup", () => {
      beforeEach(
        () =>
          (received = arrange({
            type: "RegisterPopUp",
            name: "NewPopUp",
          }))
      );

      it("should return the the expected state", () => {
        expect(received).toStrictEqual({
          ...getInitialState(),
          NewPopUp: { status: false },
        });
      });
    });

    describe("when registering an existing popup", () => {
      beforeEach(
        () =>
          (received = arrange({
            type: "RegisterPopUp",
            name: "MockPopUp",
          }))
      );

      it("should return the the expected state", () => {
        expect(received).toStrictEqual({
          ...getInitialState(),
        });
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
