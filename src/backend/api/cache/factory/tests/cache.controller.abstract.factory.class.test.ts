import ConcreteCacheControllerFactory, {
  MockedPersistenceVendorBaseClass,
  MockedVendorCdnBaseClientClass,
} from "./implementations/concrete.cache.controller.factory.class";
import CacheControllerAbstractFactory from "../cache.controller.abstract.factory.class";
import CacheController from "@src/backend/api/cache/controller/cache.controller.class";
import { mockPersistenceClient } from "@src/vendors/integrations/persistence/__mocks__/vendor.backend.mock";

jest.mock("@src/backend/api/cache/controller/cache.controller.class");

const MockedCacheController = jest.mocked(CacheController);

describe(CacheControllerAbstractFactory.name, () => {
  let instance: CacheControllerAbstractFactory<string>;

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new ConcreteCacheControllerFactory());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("create", () => {
      let result: CacheController<string>;

      beforeEach(() => (result = instance.create()));

      it("should instantiate the OriginServerPersistenceClient as expected", () => {
        expect(MockedPersistenceVendorBaseClass).toBeCalledTimes(1);
        expect(MockedPersistenceVendorBaseClass).toBeCalledWith(
          "mockPartitionName"
        );
      });

      it("should instantiate the CdnClient as expected", () => {
        expect(MockedVendorCdnBaseClientClass).toBeCalledTimes(1);
        expect(MockedVendorCdnBaseClientClass).toBeCalledWith(
          mockPersistenceClient,
          "mockCdnHostName"
        );
      });

      it("should instantiate the CacheController as expected", () => {
        expect(MockedCacheController).toBeCalledTimes(1);
        expect(MockedCacheController).toBeCalledWith(
          "mockDefaultResponse",
          MockedVendorCdnBaseClientClass.mock.instances[0]
        );
      });

      it("should return the CacheController", () => {
        expect(result).toBe(MockedCacheController.mock.instances[0]);
      });
    });
  });
});
