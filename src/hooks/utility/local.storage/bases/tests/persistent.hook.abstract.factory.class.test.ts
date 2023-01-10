import PersistentHookAbstractFactory from "../persistent.hook.abstract.factory.class";
import { mockIsSSR } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";

class ConcreteFactory extends PersistentHookAbstractFactory<jest.Mock> {
  primitiveHook = jest.fn(() => mockPrimitiveHookValue);
  hookFactory = mockHookFactory;
}

const mockPrimitiveHookValue = "mockPrimitiveHook";
const mockHookFactory = jest.fn(() => jest.fn(() => mockCreatedHookValue));
const mockCreatedHookValue = "mockCreatedHook";

jest.mock("@src/vendors/integrations/web.framework/vendor");

describe(PersistentHookAbstractFactory.name, () => {
  let instance: PersistentHookAbstractFactory<jest.Mock>;
  const mockPartitionName = "mockPartitionName";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new ConcreteFactory());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("when running in a SSR environment", () => {
      beforeEach(() => mockIsSSR.mockReturnValueOnce(true));

      describe("create", () => {
        let result: jest.Mock;

        beforeEach(() => (result = instance.create(mockPartitionName)));

        it("should return the correct result", () => {
          expect(result()).toBe(mockPrimitiveHookValue);
        });
      });
    });

    describe("when running in a browser environment", () => {
      beforeEach(() => mockIsSSR.mockReturnValueOnce(false));

      describe("create", () => {
        let result: jest.Mock;

        beforeEach(() => (result = instance.create(mockPartitionName)));

        it("should return the correct result", () => {
          expect(result()).toBe(mockCreatedHookValue);
        });

        it("should use the correct key for local storage", () => {
          expect(mockHookFactory).toBeCalledTimes(1);
          expect(mockHookFactory).toBeCalledWith(mockPartitionName);
        });
      });
    });
  });
});
