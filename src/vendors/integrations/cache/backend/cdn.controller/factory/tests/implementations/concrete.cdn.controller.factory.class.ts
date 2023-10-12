import CdnControllerAbstractFactory from "@src/vendors/integrations/cache/backend/cdn.controller/factory/cdn.controller.abstract.factory.class";
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

export default class ConcreteCacheControllerFactory extends CdnControllerAbstractFactory<string> {
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
