import {
  mockAlbumsReport,
  mockUserStateWithError,
} from "./fixtures/mock.user.state.data";
import { InitialState } from "../user.initial";
import { UserReducer } from "../user.reducer";
import type { BaseReportResponseInterface } from "../../../types/integrations/base.types";
import type { UserActionType } from "../../../types/user/action.types";
import type { UserStateInterface } from "../../../types/user/state.types";

jest.mock("../user.reducer.states.class", () => {
  return jest.fn().mockImplementation(() => {
    return mockStates;
  });
});

const mockReturnValue = "MockReturnedState";
const mockStates = {
  FailureFetchUser: jest.fn().mockReturnValue(mockReturnValue),
  StartFetchUser: jest.fn().mockReturnValue(mockReturnValue),
  SuccessFetchUser: jest.fn().mockReturnValue(mockReturnValue),
  RatelimitedFetchUser: jest.fn().mockReturnValue(mockReturnValue),
  ReadyFetchUser: jest.fn().mockReturnValue(mockReturnValue),
  ResetState: jest.fn().mockReturnValue(mockReturnValue),
};

describe("UserReducer", () => {
  let received: UserStateInterface | null;
  const testIntegrationType = "TEST";

  beforeEach(() => {
    received = null;
    jest.clearAllMocks();
  });

  const getInitialState = () => JSON.parse(JSON.stringify(InitialState));

  const arrange = (
    action: UserActionType | { type: "NoAction" },
    initialProps: UserStateInterface
  ) => {
    return UserReducer({ ...initialProps }, action as UserActionType);
  };

  it("should handle ReadyFetchUser correctly", () => {
    const action = {
      type: "ReadyFetchUser",
      userName: "someguy",
      data: mockAlbumsReport as BaseReportResponseInterface,
      integration: testIntegrationType,
    } as UserActionType;
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.ReadyFetchUser).toBeCalledTimes(1);
    expect(mockStates.ReadyFetchUser).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturnValue);
  });

  it("should handle ResetState correctly", () => {
    const action = {
      type: "ResetState",
    } as UserActionType;
    received = arrange({ type: "ResetState" }, mockUserStateWithError);
    expect(mockStates.ResetState).toBeCalledTimes(1);
    expect(mockStates.ResetState).toBeCalledWith(
      mockUserStateWithError,
      action
    );
    expect(received).toBe(mockReturnValue);
  });

  it("should handle StartFetchUser correctly", () => {
    const action = {
      type: "StartFetchUser",
      userName: "niall",
      integration: testIntegrationType,
    } as UserActionType;
    received = arrange(action, mockUserStateWithError);
    expect(mockStates.StartFetchUser).toBeCalledTimes(1);
    expect(mockStates.StartFetchUser).toBeCalledWith(
      mockUserStateWithError,
      action
    );
    expect(received).toBe(mockReturnValue);
  });

  it("should handle SuccessFetchUser correctly", () => {
    const action = {
      type: "SuccessFetchUser",
      userName: "someguy",
      data: mockAlbumsReport as BaseReportResponseInterface,
      integration: testIntegrationType,
    } as UserActionType;
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.SuccessFetchUser).toBeCalledTimes(1);
    expect(mockStates.SuccessFetchUser).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturnValue);
  });

  it("should handle FailureFetchUser correctly", () => {
    const action = {
      type: "FailureFetchUser",
      userName: "someguy",
      integration: testIntegrationType,
    } as UserActionType;
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.FailureFetchUser).toBeCalledTimes(1);
    expect(mockStates.FailureFetchUser).toBeCalledWith(InitialState, action);
    expect(received).toBe(mockReturnValue);
  });

  it("should handle RatelimitedFetchUser correctly", () => {
    const action = {
      type: "RatelimitedFetchUser",
      userName: "someguy",
      integration: testIntegrationType,
    } as UserActionType;
    received = arrange(action, { ...getInitialState() });
    expect(mockStates.RatelimitedFetchUser).toBeCalledTimes(1);
    expect(mockStates.RatelimitedFetchUser).toBeCalledWith(
      InitialState,
      action
    );
    expect(received).toBe(mockReturnValue);
  });
});
