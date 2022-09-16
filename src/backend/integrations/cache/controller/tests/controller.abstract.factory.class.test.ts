import CacheControllerAbstractFactory from "../controller.abstract.factory.class";
import CacheController from "../controller.class";

const mockCacheControllerImplementation = jest.fn();
const mockOriginServerPersistanceClientImplementation = jest.fn();
const mockOriginServerPersistanceClientClass = jest
  .fn()
  .mockReturnValue(mockOriginServerPersistanceClientImplementation);
const mockCdnClientImplementation = jest.fn();
const mockCdnClientClass = jest
  .fn()
  .mockReturnValue(mockCdnClientImplementation);

class ConcreteCacheControllerFactory extends CacheControllerAbstractFactory<string> {
  protected OriginServerPersistanceClient =
    mockOriginServerPersistanceClientClass;
  protected CdnClient = mockCdnClientClass;
  protected defaultResponse = "mockDefaultResponse";

  getPartitionName(): string {
    return "mockPartitionName";
  }

  getCdnHostname(): string {
    return "mockCdnHostName";
  }
}

jest.mock("../controller.class", () =>
  jest.fn(() => mockCacheControllerImplementation)
);

describe(CacheControllerAbstractFactory.name, () => {
  let instance: CacheControllerAbstractFactory<string>;

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new ConcreteCacheControllerFactory());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("create", () => {
      let result: CacheController<string>;

      beforeEach(() => (result = instance.create()));

      it("should instantiate the OriginServerPersistanceClient as expected", () => {
        expect(mockOriginServerPersistanceClientClass).toBeCalledTimes(1);
        expect(mockOriginServerPersistanceClientClass).toBeCalledWith(
          "mockPartitionName"
        );
      });

      it("should instantiate the CdnClient as expected", () => {
        expect(mockCdnClientClass).toBeCalledTimes(1);
        expect(mockCdnClientClass).toBeCalledWith(
          mockOriginServerPersistanceClientImplementation,
          "mockCdnHostName"
        );
      });

      it("should instantiate the CacheController as expected", () => {
        expect(CacheController).toBeCalledTimes(1);
        expect(CacheController).toBeCalledWith(
          "mockDefaultResponse",
          mockCdnClientImplementation
        );
      });

      it("should return the CacheController", () => {
        expect(result).toBe(mockCacheControllerImplementation);
      });
    });
  });
});
