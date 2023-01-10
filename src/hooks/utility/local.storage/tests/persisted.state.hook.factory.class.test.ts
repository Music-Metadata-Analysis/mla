import { useState } from "react";
import PersistentHookAbstractFactory from "../bases/persistent.hook.abstract.factory.class";
import PersistentStateFactory from "../persisted.state.hook.factory.class";
import createPersistedState from "../state/state.hook.factory";
import { mockIsSSR } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock("../state/state.hook.factory");

describe(PersistentStateFactory.name, () => {
  let instance: PersistentStateFactory;

  const mockPartitionName = "mockPartitionName";

  const mockUseState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(createPersistedState).mockReturnValue(mockUseState);
  });

  const arrange = () => (instance = new PersistentStateFactory());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should be an ancestor of PersistentHookAbstractFactory", () => {
      expect(instance).toBeInstanceOf(PersistentHookAbstractFactory);
    });

    describe("when running in a SSR environment", () => {
      beforeEach(() => mockIsSSR.mockReturnValueOnce(true));

      describe("create", () => {
        let result: typeof useState;

        beforeEach(() => (result = instance.create(mockPartitionName)));

        it("should return the correct result", () => {
          expect(result).toBe(useState);
        });
      });
    });

    describe("when running in a browser environment", () => {
      beforeEach(() => mockIsSSR.mockReturnValueOnce(false));

      describe("create", () => {
        let result: typeof useState;

        beforeEach(() => (result = instance.create(mockPartitionName)));

        it("should return the correct result", () => {
          expect(result).toBe(mockUseState);
        });

        it("should use the correct key for local storage", () => {
          expect(createPersistedState).toBeCalledTimes(1);
          expect(createPersistedState).toBeCalledWith(mockPartitionName);
        });
      });
    });
  });
});
