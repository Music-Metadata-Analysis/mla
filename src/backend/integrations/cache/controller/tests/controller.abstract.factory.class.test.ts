import CacheControllerAbstractFactory from "../controller.abstract.factory.class";
import CacheController from "../controller.class";
import VendorCdnBaseClient from "@src/backend/integrations/cache/cdn/bases/vendor.cdn.base.client.class";
import PersistanceVendorBaseClass from "@src/backend/integrations/persistance/client/bases/persistance.base.client.class";

jest.mock("../controller.class");

jest.mock(
  "@src/backend/integrations/persistance/client/bases/persistance.base.client.class"
);

jest.mock(
  "@src/backend/integrations/cache/cdn/bases/vendor.cdn.base.client.class"
);

class ConcreteCacheControllerFactory extends CacheControllerAbstractFactory<string> {
  OriginServerPersistanceClient = MockedPersistanceVendorBaseClass;
  CdnClient = MockedVendorCdnBaseClient;
  defaultResponse = "mockDefaultResponse";

  getPartitionName(): string {
    return "mockPartitionName";
  }

  getCdnHostname(): string {
    return "mockCdnHostName";
  }
}

const MockedCacheController = jest.mocked(CacheController);
const MockedPersistanceVendorBaseClass =
  PersistanceVendorBaseClass as jest.Mock<PersistanceVendorBaseClass>;
const MockedVendorCdnBaseClient = VendorCdnBaseClient as jest.Mock<
  VendorCdnBaseClient<string>
>;

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
        expect(MockedPersistanceVendorBaseClass).toBeCalledTimes(1);
        expect(MockedPersistanceVendorBaseClass).toBeCalledWith(
          "mockPartitionName"
        );
      });

      it("should instantiate the CdnClient as expected", () => {
        expect(MockedVendorCdnBaseClient).toBeCalledTimes(1);
        expect(MockedVendorCdnBaseClient).toBeCalledWith(
          MockedPersistanceVendorBaseClass.mock.instances[0],
          "mockCdnHostName"
        );
      });

      it("should instantiate the CacheController as expected", () => {
        expect(MockedCacheController).toBeCalledTimes(1);
        expect(MockedCacheController).toBeCalledWith(
          "mockDefaultResponse",
          MockedVendorCdnBaseClient.mock.instances[0]
        );
      });

      it("should return the CacheController", () => {
        expect(result).toBe(MockedCacheController.mock.instances[0]);
      });
    });
  });
});
