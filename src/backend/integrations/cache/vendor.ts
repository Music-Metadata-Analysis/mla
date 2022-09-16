import CloudFrontCdnBaseClass from "./cdn/cloudfront/cloudfront.cdn.client.class";
import CacheControllerAbstractFactory from "./controller/controller.abstract.factory.class";
import type { CacheVendor } from "../../../types/integrations/cache/vendor.types";

const cacheVendor: CacheVendor = {
  VendorBaseCdnClient: CloudFrontCdnBaseClass,
  ControllerBaseFactory: CacheControllerAbstractFactory,
};

export default cacheVendor;
