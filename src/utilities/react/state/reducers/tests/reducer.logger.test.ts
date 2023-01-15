import reducerLoggingMiddleware from "../reducer.logger";
import type { MutableEnv } from "@src/utilities/types/process.types";
import type { ActionType } from "@src/utilities/types/react/reducer.types";
import type { Reducer } from "react";

type capturedOutput = Array<string | ActionType>;
type testState = typeof testState1 | typeof testState2;

interface MockActionType extends ActionType {
  state: { key: string };
}

const testState1 = { key: "value1" };
const testState2 = { key: "value2" };

describe("reducerLoggingMiddleware", () => {
  let originalEnvironment: typeof process.env;
  let outputData: capturedOutput[];
  let reducer: Reducer<testState, MockActionType>;

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest
      .spyOn(console, "log")
      .mockImplementation((input1: string, input2: MockActionType) =>
        outputData.push([input1, input2])
      );
    outputData = [];
    const TestReducer = (state: testState, action: MockActionType) =>
      action.state;
    reducer = reducerLoggingMiddleware(TestReducer);
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  describe("when in a jest test", () => {
    beforeAll(() => {
      (process.env as MutableEnv).NODE_ENV = "test";
    });

    it("should NOT log", () => {
      reducer(testState1, { type: "BogusAction", state: testState2 });
      expect(outputData.length).toBe(0);
    });
  });

  describe("when in production", () => {
    beforeAll(() => {
      (process.env as MutableEnv).NODE_ENV = "production";
    });

    it("should NOT log", () => {
      reducer(testState1, { type: "BogusAction", state: testState2 });
      expect(outputData.length).toBe(0);
    });
  });

  describe("when not in production or test", () => {
    beforeAll(() => {
      (process.env as MutableEnv).NODE_ENV = "development";
    });

    it("should log the expected output", () => {
      const state = testState1;
      const action = { type: "BogusAction2", state: testState2 };
      reducer(state, action);
      expect(outputData).toStrictEqual([
        [
          "** TestReducer BEFORE BogusAction2:\n",
          {
            action: { type: "BogusAction2", state: testState2 },
            state: testState1,
          },
        ],
        [
          "** TestReducer AFTER BogusAction2:\n",
          {
            action: { type: "BogusAction2", state: testState2 },
            state: testState2,
          },
        ],
      ]);
    });
  });
});
