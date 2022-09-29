import ArtistImageCacheControllerFactory from "../artist.image.cache.factory.class";
import CacheController from "@src/backend/integrations/cache/controller/controller.class";

jest.mock("@src/backend/integrations/persistance/vendor");

describe(ArtistImageCacheControllerFactory.name, () => {
  let instance: ArtistImageCacheControllerFactory;
  const originalEnvironment = process.env;

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const setupEnv = () => {
    process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME = "MockValue1";
    process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME = "MockValue2";
  };

  beforeEach(() => {
    setupEnv();
    jest.clearAllMocks();
  });

  const arrange = () => (instance = new ArtistImageCacheControllerFactory());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("create", () => {
      let result: CacheController<string>;

      beforeEach(() => (result = instance.create()));

      it("should create the correct type of controller", () => {
        expect(result).toBeInstanceOf(CacheController);
      });
    });

    describe("getPartitionName", () => {
      let result: string;

      beforeEach(() => (result = instance.getPartitionName()));

      it("should return the expected value", () => {
        expect(result).toBe("MockValue1");
      });
    });

    describe("getCdnHostname", () => {
      let result: string;

      beforeEach(() => (result = instance.getCdnHostname()));

      it("should return the expected value", () => {
        expect(result).toBe("MockValue2");
      });
    });
  });
});
