import ArtistImageCacheControllerFactory from "../artist.image.cache.controller.factory.class";
import ArtistImageCdnClient from "../cdn/artist.image.cdn.client.class";
import { cacheVendorBackend } from "@src/vendors/integrations/cache/vendor.backend";
import { mockPersistenceClient } from "@src/vendors/integrations/persistence/__mocks__/vendor.backend.mock";
import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";
import type { CacheVendorCdnControllerInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";

jest.mock("../cdn/artist.image.cdn.client.class");

jest.mock("@src/vendors/integrations/cache/vendor.backend");

jest.mock("@src/vendors/integrations/persistence/vendor.backend");

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
      let result: CacheVendorCdnControllerInterface<string>;

      beforeEach(() => (result = instance.create()));

      it("should instantiate the PersistenceClient as expected", () => {
        expect(persistenceVendorBackend.PersistenceClient).toBeCalledTimes(1);
        expect(persistenceVendorBackend.PersistenceClient).toBeCalledWith(
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
        expect(cacheVendorBackend.CdnController).toBeCalledTimes(1);
        expect(cacheVendorBackend.CdnController).toBeCalledWith(
          "",
          jest.mocked(ArtistImageCdnClient).mock.instances[0]
        );
      });

      it("should return the CacheController", () => {
        expect(result).toBe(
          jest.mocked(cacheVendorBackend.CdnController).mock.instances[0]
        );
      });
    });
  });
});
