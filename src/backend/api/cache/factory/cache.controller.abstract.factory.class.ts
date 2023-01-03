import CacheController from "@src/backend/api/cache/controller/cache.controller.class";
import type { CacheControllerFactoryInterface } from "@src/backend/api/types/cache/factory.types";
import type { CacheVendorCdnInterface } from "@src/types/integrations/cache/vendor.types";
import type { PersistenceVendorClientInterface } from "@src/types/integrations/persistence/vendor.types";

export default abstract class CacheControllerAbstractFactory<ObjectType>
  implements CacheControllerFactoryInterface<ObjectType>
{
  protected abstract OriginServerPersistenceClient: new (
    partitionType: string
  ) => PersistenceVendorClientInterface;
  protected abstract CdnClient: new (
    originServerClient: PersistenceVendorClientInterface,
    cdnHostname: string
  ) => CacheVendorCdnInterface<ObjectType>;
  protected abstract defaultResponse: ObjectType;

  protected abstract getPartitionName(): string;

  protected abstract getCdnHostname(): string;

  public create(): CacheController<ObjectType> {
    const vendorPersistenceImplementation =
      new this.OriginServerPersistenceClient(this.getPartitionName());
    const vendorCdnImplementation = new this.CdnClient(
      vendorPersistenceImplementation,
      this.getCdnHostname()
    );

    return new CacheController(this.defaultResponse, vendorCdnImplementation);
  }
}
