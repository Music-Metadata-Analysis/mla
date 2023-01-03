import CloudFrontCdnBaseClass from "./cdn/cloudfront";
import type { CacheVendorInterface } from "@src/types/integrations/cache/vendor.types";

const cacheVendor: CacheVendorInterface = {
  CdnBaseClient: CloudFrontCdnBaseClass,
};

export default cacheVendor;
