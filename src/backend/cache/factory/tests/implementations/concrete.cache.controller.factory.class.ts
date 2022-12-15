import CacheControllerAbstractFactory from "@src/backend/cache/factory/cache.controller.abstract.factory.class";
import CdnAbstractBaseClient from "@src/backend/integrations/cache/cdn/bases/cdn.base.client.class";
import PersistanceVendorBaseClass from "@src/backend/integrations/persistance/client/bases/persistance.base.client.class";

jest.mock("@src/backend/integrations/cache/cdn/bases/cdn.base.client.class");

jest.mock(
  "@src/backend/integrations/persistance/client/bases/persistance.base.client.class"
);

export const MockedPersistanceVendorBaseClass =
  PersistanceVendorBaseClass as jest.Mock<PersistanceVendorBaseClass>;
export const MockedVendorCdnBaseClient = CdnAbstractBaseClient as jest.Mock<
  CdnAbstractBaseClient<string>
>;

export default class ConcreteCacheControllerFactory extends CacheControllerAbstractFactory<string> {
  public OriginServerPersistanceClient = MockedPersistanceVendorBaseClass;
  public CdnClient = MockedVendorCdnBaseClient;
  public defaultResponse = "mockDefaultResponse";

  protected getPartitionName(): string {
    return "mockPartitionName";
  }

  protected getCdnHostname(): string {
    return "mockCdnHostName";
  }
}
