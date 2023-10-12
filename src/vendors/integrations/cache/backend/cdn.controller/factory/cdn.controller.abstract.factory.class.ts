import CdnController from "@src/vendors/integrations/cache/backend/cdn.controller/controller/cdn.controller.class";
import type {
  CacheVendorCdnInterface,
  CacheVendorCdnControllerFactoryInterface,
} from "@src/vendors/types/integrations/cache/vendor.backend.types";
import type { PersistenceVendorClientInterface } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export default abstract class CdnControllerAbstractFactory<ObjectType>
  implements CacheVendorCdnControllerFactoryInterface<ObjectType>
{
  protected abstract OriginServerPersistenceClientClass: new (
    partitionType: string
  ) => PersistenceVendorClientInterface;
  protected abstract CdnClientClass: new (
    originServerClient: PersistenceVendorClientInterface,
    cdnHostname: string
  ) => CacheVendorCdnInterface<ObjectType>;
  protected abstract defaultResponse: ObjectType;

  protected abstract getPartitionName(): string;

  protected abstract getCdnHostname(): string;

  public create(): CdnController<ObjectType> {
    const vendorPersistenceImplementation =
      new this.OriginServerPersistenceClientClass(this.getPartitionName());
    const vendorCdnImplementation = new this.CdnClientClass(
      vendorPersistenceImplementation,
      this.getCdnHostname()
    );

    return new CdnController(this.defaultResponse, vendorCdnImplementation);
  }
}
