import ArtistImageCacheControllerFactory from "../artist.image.cache.controller.factory.class";
import ArtistImageCdnClient from "../cdn/artist.image.cdn.client.class";
import CacheController from "@src/backend/api/cache/controller/cache.controller.class";
import { mockPersistenceClient } from "@src/backend/api/integrations/persistence/__mocks__/vendor.mock";
import persistenceVendor from "@src/backend/api/integrations/persistence/vendor";

jest.mock("../cdn/artist.image.cdn.client.class");

jest.mock("@src/backend/api/cache/controller/cache.controller.class");

jest.mock("@src/backend/api/integrations/persistence/vendor");

describe(ArtistImageCacheControllerFactory.name, () => {
  let instance: ArtistImageCacheControllerFactory;
  let originalEnvironment: typeof process.env;

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setupEnv();
  });

  const setupEnv = () => {
    process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME = "MockValue1";
    process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME = "MockValue2";
  };

  const arrange = () => (instance = new ArtistImageCacheControllerFactory());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("create", () => {
      let result: CacheController<string>;

      beforeEach(() => (result = instance.create()));

      it("should instantiate the PersistenceClient as expected", () => {
        expect(persistenceVendor.PersistenceClient).toBeCalledTimes(1);
        expect(persistenceVendor.PersistenceClient).toBeCalledWith(
          "MockValue1"
        );
      });

      it("should instantiate the CdnClient as expected", () => {
        expect(ArtistImageCdnClient).toBeCalledTimes(1);
        expect(ArtistImageCdnClient).toBeCalledWith(
          mockPersistenceClient,
          "MockValue2"
        );
      });

      it("should instantiate the CacheController as expected", () => {
        expect(CacheController).toBeCalledTimes(1);
        expect(CacheController).toBeCalledWith(
          "",
          jest.mocked(ArtistImageCdnClient).mock.instances[0]
        );
      });

      it("should return the CacheController", () => {
        expect(result).toBe(jest.mocked(CacheController).mock.instances[0]);
      });
    });
  });
});
