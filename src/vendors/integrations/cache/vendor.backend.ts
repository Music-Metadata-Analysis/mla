import CloudFrontCdnBaseClass from "./backend/cdn/cloudfront";
import type { CacheVendorBackendInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";

export const cacheVendorBackend: CacheVendorBackendInterface = {
  CdnBaseClient: CloudFrontCdnBaseClass,
};
