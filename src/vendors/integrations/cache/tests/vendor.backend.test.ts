import CloudFrontCdnBaseClass from "../backend/cdn/cloudfront";
import { cacheVendorBackend } from "../vendor.backend";

describe("cacheVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(cacheVendorBackend.CdnBaseClient).toBe(CloudFrontCdnBaseClass);
  });
});
