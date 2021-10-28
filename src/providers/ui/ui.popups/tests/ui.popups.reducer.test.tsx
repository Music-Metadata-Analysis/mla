import { InitialState } from "../ui.popups.initial";
import { UserInterfacePopUpsReducer } from "../ui.popups.reducer";
import type { UserInterfacePopUpsActionType } from "../../../../types/ui/popups/ui.popups.action.types";
import type { UserInterfacePopUpsStateInterface } from "../../../../types/ui/popups/ui.popups.state.types";

jest.mock("../ui.popups.reducer.states.class", () => {
  return jest.fn().mockImplementation(() => {
    return mockStates;
  });
});

const mockReturn = "MockReturnedState";
const mockStates = {
  HidePopUp: jest.fn().mockReturnValue(mockReturn),
  ShowPopUp: jest.fn().mockReturnValue(mockReturn),
};

describe("UserInterfacePopUpsReducer", () => {
  let received: UserInterfacePopUpsStateInterface | null;

  beforeEach(() => {
    received = null;
    jest.clearAllMocks();
  });

  const getInitialState = () =>
    JSON.parse(
      JSON.stringify(InitialState)
    ) as UserInterfacePopUpsStateInterface;

  const arrange = (
    action: UserInterfacePopUpsActionType | { type: "NoAction" },
    initialProps: UserInterfacePopUpsStateInterface
  ) => {
    return UserInterfacePopUpsReducer(
      { ...initialProps },
      action as UserInterfacePopUpsActionType
    ) as UserInterfacePopUpsStateInterface;
  };

  it("should handle HidePopUp correctly", () => {
    const action = {
      type: "HidePopUp",
      name: "FeedBack",
    } as UserInterfacePopUpsActionType;
    received = arrange(action, getInitialState());
    expect(mockStates.HidePopUp).toBeCalledTimes(1);
    expect(mockStates.HidePopUp).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturn);
  });

  it("should handle ShowPopUp correctly", () => {
    const action = {
      type: "ShowPopUp",
      name: "FeedBack",
    } as UserInterfacePopUpsActionType;
    received = arrange(action, getInitialState());
    expect(mockStates.ShowPopUp).toBeCalledTimes(1);
    expect(mockStates.ShowPopUp).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturn);
  });
});
