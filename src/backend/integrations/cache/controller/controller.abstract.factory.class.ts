import CacheController from "./controller.class";
import type {
  CacheFactoryInterface,
  CdnVendorInterface,
} from "../../../../types/integrations/cache/vendor.types";
import type { PersistanceVendorInterface } from "../../../../types/integrations/persistance/vendor.types";

export default abstract class CacheControllerAbstractFactory<ObjectType>
  implements CacheFactoryInterface<ObjectType>
{
  protected abstract OriginServerPersistanceClient: new (
    partitionType: string
  ) => PersistanceVendorInterface;
  protected abstract CdnClient: new (
    originServerClient: PersistanceVendorInterface,
    cdnHostname: string
  ) => CdnVendorInterface<ObjectType>;
  protected abstract defaultResponse: ObjectType;

  abstract getPartitionName(): string;

  abstract getCdnHostname(): string;

  create(): CacheController<ObjectType> {
    const vendorPersistanceImplementation =
      new this.OriginServerPersistanceClient(this.getPartitionName());
    const vendorCdnImplementation = new this.CdnClient(
      vendorPersistanceImplementation,
      this.getCdnHostname()
    );

    return new CacheController(this.defaultResponse, vendorCdnImplementation);
  }
}
