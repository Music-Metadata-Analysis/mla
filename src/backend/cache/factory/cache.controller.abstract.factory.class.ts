import CacheController from "@src/backend/cache/controller/cache.controller.class";
import type { CacheControllerFactoryInterface } from "@src/backend/types/cache/factory.types";
import type { CacheVendorCdnInterface } from "@src/types/integrations/cache/vendor.types";
import type { PersistanceVendorInterface } from "@src/types/integrations/persistance/vendor.types";

export default abstract class CacheControllerAbstractFactory<ObjectType>
  implements CacheControllerFactoryInterface<ObjectType>
{
  protected abstract OriginServerPersistanceClient: new (
    partitionType: string
  ) => PersistanceVendorInterface;
  protected abstract CdnClient: new (
    originServerClient: PersistanceVendorInterface,
    cdnHostname: string
  ) => CacheVendorCdnInterface<ObjectType>;
  protected abstract defaultResponse: ObjectType;

  protected abstract getPartitionName(): string;

  protected abstract getCdnHostname(): string;

  public create(): CacheController<ObjectType> {
    const vendorPersistanceImplementation =
      new this.OriginServerPersistanceClient(this.getPartitionName());
    const vendorCdnImplementation = new this.CdnClient(
      vendorPersistanceImplementation,
      this.getCdnHostname()
    );

    return new CacheController(this.defaultResponse, vendorCdnImplementation);
  }
}
