import { useReducer } from "react";
import createPersistedReducer from "use-persisted-reducer";
import PersistentHookAbstractFactory from "../bases/persistent.hook.abstract.factory";
import PersistentReducerFactory from "../persisted.reducer.factory";
import { mockIsSSR } from "@src/clients/web.framework/__mocks__/vendor.mock";

jest.mock("@src/clients/web.framework/vendor");

jest.mock("use-persisted-reducer", () => jest.fn(() => mockReducer));

const mockReducer = jest.fn();

describe(PersistentReducerFactory.name, () => {
  let instance: PersistentReducerFactory;
  const mockPartitionName = "mockPartitionName";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new PersistentReducerFactory());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should be an ancestor of PersistentHookAbstractFactory", () => {
      expect(instance).toBeInstanceOf(PersistentHookAbstractFactory);
    });

    describe("when running in a SSR environment", () => {
      beforeEach(() => mockIsSSR.mockReturnValueOnce(true));

      describe("create", () => {
        let result: typeof useReducer;

        beforeEach(() => (result = instance.create(mockPartitionName)));

        it("should return the correct result", () => {
          expect(result).toBe(useReducer);
        });
      });
    });

    describe("when running in a browser environment", () => {
      beforeEach(() => mockIsSSR.mockReturnValueOnce(false));

      describe("create", () => {
        let result: typeof useReducer;

        beforeEach(() => (result = instance.create(mockPartitionName)));

        it("should return the correct result", () => {
          expect(result).toBe(mockReducer);
        });

        it("should use the correct key for local storage", () => {
          expect(createPersistedReducer).toBeCalledTimes(1);
          expect(createPersistedReducer).toBeCalledWith(mockPartitionName);
        });
      });
    });
  });
});
