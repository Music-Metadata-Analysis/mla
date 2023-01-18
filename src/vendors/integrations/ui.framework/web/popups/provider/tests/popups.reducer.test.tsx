import { PopUpsControllerReducer } from "../popups.reducer";
import type { PopUpsControllerActionType } from "@src/vendors/types/integrations/ui.framework/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.state.types";

jest.mock("../popups.reducer.states.class", () => jest.fn(() => mockStates));

const mockReturn = "MockReturnedState";
const mockStates = {
  HidePopUp: jest.fn(() => mockReturn),
  ShowPopUp: jest.fn(() => mockReturn),
};

const mockInitialState = {
  MockPopUp: { status: false },
  FeedBack: { status: false },
};

describe("PopUpsControllerReducer", () => {
  let received: PopUpsControllerStateInterface | null;

  beforeEach(() => {
    received = null;
    jest.clearAllMocks();
  });

  const getInitialState = () =>
    JSON.parse(
      JSON.stringify(mockInitialState)
    ) as PopUpsControllerStateInterface;

  const arrange = (
    action: PopUpsControllerActionType | { type: "NoAction" },
    initialProps: PopUpsControllerStateInterface
  ) => {
    return PopUpsControllerReducer(
      { ...initialProps },
      action as PopUpsControllerActionType
    ) as PopUpsControllerStateInterface;
  };

  it("should handle HidePopUp correctly", () => {
    const action = {
      type: "HidePopUp",
      name: "FeedBack",
    } as PopUpsControllerActionType;
    received = arrange(action, getInitialState());
    expect(mockStates.HidePopUp).toBeCalledTimes(1);
    expect(mockStates.HidePopUp).toBeCalledWith(mockInitialState, action);
    expect(received).toBe(mockReturn);
  });

  it("should handle ShowPopUp correctly", () => {
    const action = {
      type: "ShowPopUp",
      name: "FeedBack",
    } as PopUpsControllerActionType;
    received = arrange(action, getInitialState());
    expect(mockStates.ShowPopUp).toBeCalledTimes(1);
    expect(mockStates.ShowPopUp).toBeCalledWith(mockInitialState, action);
    expect(received).toBe(mockReturn);
  });
});
