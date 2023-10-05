import applyMiddleware from "../reducer.middleware";
import type { WebFrameworkVendorReducerActionType } from "@src/vendors/types/integrations/web.framework/vendor.types";
import type { Reducer } from "react";

type MockStateType = Record<string, unknown>;

const callStack: WebFrameworkVendorReducerActionType[] = [];
let receivedAction: WebFrameworkVendorReducerActionType;

const mockReducer = (
  state: MockStateType,
  action: WebFrameworkVendorReducerActionType
) => {
  receivedAction = action;
  switch (action.type) {
    default:
      return state;
  }
};

const mockMiddleware = (
  reducer: Reducer<MockStateType, WebFrameworkVendorReducerActionType>
) => {
  const wrappedReducer = (
    state: MockStateType,
    action: WebFrameworkVendorReducerActionType
  ) => {
    callStack.push(action);
    return reducer(state, action);
  };
  return wrappedReducer;
};

type MockedMiddlewareOrReducer =
  | jest.Mock<typeof mockMiddleware>
  | jest.Mock<typeof mockReducer>;

describe("withMiddleware", () => {
  let mockMiddleware1: MockedMiddlewareOrReducer;
  let mockMiddleware2: MockedMiddlewareOrReducer;
  let mockMiddleware3: MockedMiddlewareOrReducer;
  let wrappedReducer: Reducer<
    MockStateType,
    WebFrameworkVendorReducerActionType
  >;

  const createMiddlewareStack = () => {
    mockMiddleware1 = jest.fn((i) => mockMiddleware(i));
    mockMiddleware2 = jest.fn((i) => mockMiddleware(i));
    mockMiddleware3 = jest.fn((i) => mockMiddleware(i));
    return [mockMiddleware1, mockMiddleware2, mockMiddleware3];
  };

  beforeEach(() => {
    wrappedReducer = applyMiddleware(mockReducer, createMiddlewareStack());
  });

  it("should correctly encapsulates the reducer", () => {
    expect(mockMiddleware1.mock.calls.length).toBe(1);
    expect(mockMiddleware2.mock.calls.length).toBe(1);
    expect(mockMiddleware3.mock.calls.length).toBe(1);
    expect(mockMiddleware1.mock.calls[0][0]).toBe(mockReducer);
    expect(mockMiddleware2.mock.calls[0][0].name).toBe("wrappedReducer");
    expect(mockMiddleware3.mock.calls[0][0].name).toBe("wrappedReducer");
  });

  it("should create an encapsulated reducer that works as expected", () => {
    const test_action = { type: "MockAction", state: { mock: "State" } };
    expect(callStack.length).toBe(0);
    expect(receivedAction).toBeUndefined();
    wrappedReducer({}, test_action);
    expect(callStack).toStrictEqual([test_action, test_action, test_action]);
    expect(receivedAction).toBe(test_action);
  });
});
