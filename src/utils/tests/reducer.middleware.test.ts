import { Reducer } from "react";
import withMiddleware from "../reducer.middleware";
import { ActionType } from "../../types/reducer.types";

const callStack: any[] = [];
let receivedAction: any;

const mockReducer = (state: any, action: any) => {
  receivedAction = action;
  switch (action.type) {
    default:
      return state;
  }
};

const mockMiddleware = (reducer: Reducer<any, ActionType>) => {
  const wrappedReducer = (state: any, action: ActionType) => {
    callStack.push(action);
    return reducer(state, action);
  };
  return wrappedReducer;
};

type MockedMiddlewareorReducer =
  | jest.Mock<typeof mockMiddleware>
  | jest.Mock<typeof mockReducer>;

describe("withMiddleware", () => {
  let mockMiddleware1: MockedMiddlewareorReducer;
  let mockMiddleware2: MockedMiddlewareorReducer;
  let mockMiddleware3: MockedMiddlewareorReducer;
  let wrappedReducer: Reducer<any, ActionType>;

  const createMiddlewareStack = () => {
    mockMiddleware1 = jest.fn((i) => mockMiddleware(i));
    mockMiddleware2 = jest.fn((i) => mockMiddleware(i));
    mockMiddleware3 = jest.fn((i) => mockMiddleware(i));
    return [mockMiddleware1, mockMiddleware2, mockMiddleware3];
  };

  beforeEach(() => {
    wrappedReducer = withMiddleware(mockReducer, createMiddlewareStack());
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
    const test_action = { type: "BogusAction", state: {} };
    expect(callStack.length).toBe(0);
    expect(receivedAction).toBeUndefined();
    wrappedReducer({}, test_action);
    expect(callStack).toStrictEqual([test_action, test_action, test_action]);
    expect(receivedAction).toBe(test_action);
  });
});
