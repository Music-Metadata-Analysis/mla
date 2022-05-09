import {
  mockAlbumsReport,
  mockUserStateWithError,
} from "./fixtures/mock.user.state.data";
import UserReducerStateBase from "../states/user.reducer.states.base.class";
import { InitialState } from "../user.initial";
import { UserReducer } from "../user.reducer";
import type { BaseReportResponseInterface } from "../../../types/integrations/base.types";
import type { UserActionType } from "../../../types/user/action.types";
import type { UserStateInterface } from "../../../types/user/state.types";

class ConcreteStateOne extends UserReducerStateBase<"ReadyFetch"> {
  type = "ReadyFetch" as const;
  generateState(): UserStateInterface {
    return mockReadyState as unknown as UserStateInterface;
  }
}

class ConcreteStateTwo extends UserReducerStateBase<"ResetState"> {
  type = "ResetState" as const;
  generateState(): UserStateInterface {
    return mockResetState as unknown as UserStateInterface;
  }
}

class ConcreteStateThree extends UserReducerStateBase<"StartFetch"> {
  type = "StartFetch" as const;
  generateState(): UserStateInterface {
    return mockStartState as unknown as UserStateInterface;
  }
}

jest.mock("../states/user.reducer.states", () => {
  return () => mockClasses;
});

const mockClasses = [ConcreteStateOne, ConcreteStateTwo, ConcreteStateThree];
const mockReadyState = "mockReadyState";
const mockResetState = "mockResetState";
const mockStartState = "mockStartState";

describe("UserReducer", () => {
  let received: UserStateInterface | null;
  const testIntegrationType = "TEST" as const;

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

  it("should handle ReadyFetch correctly", () => {
    const action = {
      type: "ReadyFetch" as const,
      userName: "someguy",
      data: mockAlbumsReport as BaseReportResponseInterface,
      integration: testIntegrationType,
    };
    received = arrange(action, { ...getInitialState() });
    expect(received).toBe(mockReadyState);
  });

  it("should handle ResetState correctly", () => {
    const action = {
      type: "ResetState" as const,
    };
    received = arrange(action, mockUserStateWithError);
    expect(received).toBe(mockResetState);
  });

  it("should handle StartFetch correctly", () => {
    const action = {
      type: "StartFetch" as const,
      userName: "someguy",
      integration: testIntegrationType,
    };
    received = arrange(action, mockUserStateWithError);
    expect(received).toBe(mockStartState);
  });

  it("should handle an Unknown Action correctly", () => {
    const action = {
      type: "UnknownAction",
    } as unknown as UserActionType;
    received = arrange(action, { ...getInitialState() });
    expect(received).toStrictEqual({ ...getInitialState() });
  });
});
