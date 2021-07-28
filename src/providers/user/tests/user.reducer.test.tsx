import InitialValues from "../user.initial";
import { UserReducer } from "../user.reducer";
import type { TopAlbumsReportResponseInterface } from "../../../types/proxy.types";
import type { UserActionType } from "../../../types/user/action.types";
import type { UserStateInterface } from "../../../types/user/state.types";

const mockStates = {
  FailureFetchUser: jest.fn(),
  StartFetchUser: jest.fn(),
  SuccessFetchUser: jest.fn(),
  RatelimitedFetchUser: jest.fn(),
  ResetState: jest.fn(),
};

jest.mock("../user.reducer.states.class", () => {
  return jest.fn().mockImplementation(() => {
    return mockStates;
  });
});

describe("UserReducer", () => {
  let received: UserStateInterface | null;
  const testIntegrationType = "TEST";
  const initialReport = { albums: [], image: [] };
  const badInitialUserState = {
    userName: "somebody",
    ratelimited: true,
    data: {
      integration: null,
      report: initialReport,
    },
    error: true,
    profileUrl: "http://localhost",
    ready: true,
  };

  beforeEach(() => {
    received = null;
    jest.clearAllMocks();
  });

  const arrange = (
    action: UserActionType | { type: "NoAction" },
    initialProps: UserStateInterface
  ) => {
    return UserReducer({ ...initialProps }, action as UserActionType);
  };

  it("should handle ResetState correctly", () => {
    const action = {
      type: "ResetState",
    } as UserActionType;
    received = arrange({ type: "ResetState" }, badInitialUserState);
    expect(mockStates.ResetState).toBeCalledTimes(1);
    expect(mockStates.ResetState).toBeCalledWith(action);
  });

  it("should handle StartFetchUser correctly", () => {
    const action = {
      type: "StartFetchUser",
      userName: "niall",
      integration: testIntegrationType,
    } as UserActionType;
    received = arrange(action, badInitialUserState);
    expect(mockStates.StartFetchUser).toBeCalledTimes(1);
    expect(mockStates.StartFetchUser).toBeCalledWith(action);
  });

  it("should handle SuccessFetchUser correctly", () => {
    const mock_lastfm_data = {
      albums: [],
      image: [
        {
          size: "large",
          "#text": "http://someurl.com",
        },
      ],
    };
    const action = {
      type: "SuccessFetchUser",
      userName: "someguy",
      data: mock_lastfm_data as TopAlbumsReportResponseInterface,
      integration: testIntegrationType,
    } as UserActionType;
    received = arrange(action, { ...InitialValues.userProperties });
    expect(mockStates.SuccessFetchUser).toBeCalledTimes(1);
    expect(mockStates.SuccessFetchUser).toBeCalledWith(action);
  });

  it("should handle FailureFetchUser correctly", () => {
    const action = {
      type: "FailureFetchUser",
      userName: "someguy",
      integration: testIntegrationType,
    } as UserActionType;
    received = arrange(action, { ...InitialValues.userProperties });
    expect(mockStates.FailureFetchUser).toBeCalledTimes(1);
    expect(mockStates.FailureFetchUser).toBeCalledWith(action);
  });

  it("should handle RatelimitedFetchUser correctly", () => {
    const action = {
      type: "RatelimitedFetchUser",
      userName: "someguy",
      integration: testIntegrationType,
    } as UserActionType;
    received = arrange(action, { ...InitialValues.userProperties });
    expect(mockStates.RatelimitedFetchUser).toBeCalledTimes(1);
    expect(mockStates.RatelimitedFetchUser).toBeCalledWith(action);
  });
});
