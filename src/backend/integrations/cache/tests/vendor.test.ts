import CloudFrontCdnBaseClass from "../cdn/cloudfront";
import cacheVendor from "../vendor";

describe("cacheVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(cacheVendor.CdnBaseClient).toBe(CloudFrontCdnBaseClass);
  });
});
