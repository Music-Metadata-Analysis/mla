import { useState } from "react";
import PersistentHookAbstractFactory from "../bases/persistent.hook.abstract.factory";
import createPersistedState from "../local.storage.state/local.storage.state.hook.factory";
import PersistentStateFactory from "../persisted.state.factory";
import { mockIsSSR } from "@src/clients/web.framework/__mocks__/vendor.mock";

jest.mock("@src/clients/web.framework/vendor");

jest.mock("../local.storage.state/local.storage.state.hook.factory", () =>
  jest.fn(() => mockUseState)
);

const mockUseState = jest.fn();

describe(PersistentStateFactory.name, () => {
  let instance: PersistentStateFactory;
  const mockPartitionName = "mockPartitionName";

  beforeEach(() => jest.clearAllMocks());

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
