import CacheControllerAbstractFactory from "@src/backend/api/cache/factory/cache.controller.abstract.factory.class";
//TODO: use the vendor object itself to fix this
import CdnAbstractBaseClient from "@src/vendors/integrations/cache/backend/cdn/bases/cdn.base.client.class";
import PersistenceVendorBaseClass from "@src/vendors/integrations/persistence/backend/client/bases/persistence.base.client.class";

jest.mock(
  "@src/vendors/integrations/cache/backend/cdn/bases/cdn.base.client.class"
);

jest.mock(
  "@src/vendors/integrations/persistence/backend/client/bases/persistence.base.client.class"
);

export const MockedPersistenceVendorBaseClass =
  PersistenceVendorBaseClass as jest.Mock<PersistenceVendorBaseClass>;
export const MockedVendorCdnBaseClient = CdnAbstractBaseClient as jest.Mock<
  CdnAbstractBaseClient<string>
>;

export default class ConcreteCacheControllerFactory extends CacheControllerAbstractFactory<string> {
  public OriginServerPersistenceClient = MockedPersistenceVendorBaseClass;
  public CdnClient = MockedVendorCdnBaseClient;
  public defaultResponse = "mockDefaultResponse";

  protected getPartitionName(): string {
    return "mockPartitionName";
  }

  protected getCdnHostname(): string {
    return "mockCdnHostName";
  }
}
