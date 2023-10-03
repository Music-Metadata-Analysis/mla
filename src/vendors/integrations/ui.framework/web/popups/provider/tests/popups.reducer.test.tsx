import {
  corePopUpsControllerReducer,
  PopUpsControllerReducer,
} from "../popups.reducer";
import {
  mockApplyMiddleware,
  mockLoggingMiddleware,
} from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import type { PopUpsControllerActionType } from "@src/vendors/types/integrations/ui.framework/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.state.types";

jest.mock("@src/vendors/integrations/web.framework/vendor");

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
    mockStates.HidePopUp.mockClear();
    mockStates.ShowPopUp.mockClear();
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

  it("should be wrapped in the correct middlewares", () => {
    expect(mockApplyMiddleware).toBeCalledTimes(1);
    expect(mockApplyMiddleware).toBeCalledWith(corePopUpsControllerReducer, [
      mockLoggingMiddleware,
    ]);
  });

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
