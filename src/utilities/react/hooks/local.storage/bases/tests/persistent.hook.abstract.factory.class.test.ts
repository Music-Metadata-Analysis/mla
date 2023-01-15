import PersistentHookAbstractFactory from "../persistent.hook.abstract.factory.class";

class ConcreteFactory extends PersistentHookAbstractFactory<jest.Mock> {
  primitiveHook = jest.fn(() => mockPrimitiveHookValue);
  hookFactory = mockHookFactory;
}

const mockPrimitiveHookValue = "mockPrimitiveHook";
const mockHookFactory = jest.fn(() => jest.fn(() => mockCreatedHookValue));
const mockCreatedHookValue = "mockCreatedHook";

describe(PersistentHookAbstractFactory.name, () => {
  let instance: PersistentHookAbstractFactory<jest.Mock>;
  let mockIsSSR: boolean;

  const mockPartitionName = "mockPartitionName";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new ConcreteFactory());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("when running in a SSR environment", () => {
      beforeEach(() => (mockIsSSR = true));

      describe("create", () => {
        let result: jest.Mock;

        beforeEach(
          () => (result = instance.create(mockPartitionName, mockIsSSR))
        );

        it("should return the correct result", () => {
          expect(result()).toBe(mockPrimitiveHookValue);
        });
      });
    });

    describe("when running in a browser environment", () => {
      beforeEach(() => (mockIsSSR = false));

      describe("create", () => {
        let result: jest.Mock;

        beforeEach(
          () => (result = instance.create(mockPartitionName, mockIsSSR))
        );

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
