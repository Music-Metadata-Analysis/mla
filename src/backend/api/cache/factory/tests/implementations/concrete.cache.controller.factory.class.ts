import CacheControllerAbstractFactory from "@src/backend/api/cache/factory/cache.controller.abstract.factory.class";
import { cacheVendorBackend } from "@src/vendors/integrations/cache/vendor.backend";
import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";
import type { CacheVendorCdnInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";

jest.mock("@src/vendors/integrations/cache/vendor.backend");

jest.mock("@src/vendors/integrations/persistence/vendor.backend");

export const MockedPersistenceVendorBaseClass =
  persistenceVendorBackend.PersistenceClient;
export const MockedVendorCdnBaseClientClass =
  cacheVendorBackend.CdnBaseClient as jest.Mock<
    CacheVendorCdnInterface<string>
  >;

export default class ConcreteCacheControllerFactory extends CacheControllerAbstractFactory<string> {
  public OriginServerPersistenceClientClass = MockedPersistenceVendorBaseClass;
  public CdnClientClass = MockedVendorCdnBaseClientClass;
  public defaultResponse = "mockDefaultResponse";

  protected getPartitionName(): string {
    return "mockPartitionName";
  }

  protected getCdnHostname(): string {
    return "mockCdnHostName";
  }
}
