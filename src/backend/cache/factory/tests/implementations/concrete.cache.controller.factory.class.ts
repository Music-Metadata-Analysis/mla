import CacheControllerAbstractFactory from "@src/backend/cache/factory/cache.controller.abstract.factory.class";
import CdnAbstractBaseClient from "@src/backend/integrations/cache/cdn/bases/cdn.base.client.class";
import PersistenceVendorBaseClass from "@src/backend/integrations/persistence/client/bases/persistence.base.client.class";

jest.mock("@src/backend/integrations/cache/cdn/bases/cdn.base.client.class");

jest.mock(
  "@src/backend/integrations/persistence/client/bases/persistence.base.client.class"
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