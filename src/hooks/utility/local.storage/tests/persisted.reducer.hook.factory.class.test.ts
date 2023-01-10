import { useReducer } from "react";
import createPersistedReducer from "use-persisted-reducer";
import PersistentHookAbstractFactory from "../bases/persistent.hook.abstract.factory.class";
import PersistentReducerFactory from "../persisted.reducer.hook.factory.class";
import { mockIsSSR } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock("use-persisted-reducer");

describe(PersistentReducerFactory.name, () => {
  let instance: PersistentReducerFactory;

  const mockPartitionName = "mockPartitionName";

  const mockUseReducer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(createPersistedReducer).mockReturnValue(mockUseReducer);
  });

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
          expect(result).toBe(mockUseReducer);
        });

        it("should use the correct key for local storage", () => {
          expect(createPersistedReducer).toBeCalledTimes(1);
          expect(createPersistedReducer).toBeCalledWith(mockPartitionName);
        });
      });
    });
  });
});
