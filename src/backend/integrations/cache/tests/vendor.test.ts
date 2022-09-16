import CloudFrontCdnBaseClass from "../cdn/cloudfront/cloudfront.cdn.client.class";
import CacheControllerAbstractFactory from "../controller/controller.abstract.factory.class";
import cacheVendor from "../vendor";

describe("cacheVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(cacheVendor.ControllerBaseFactory).toBe(
      CacheControllerAbstractFactory
    );
    expect(cacheVendor.VendorCdnBaseClient).toBe(CloudFrontCdnBaseClass);
  });
});
