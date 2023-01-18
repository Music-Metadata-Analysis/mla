import ArtistImageCdnClient from "./cdn/artist.image.cdn.client.class";
import CacheControllerAbstractFactory from "@src/backend/api/cache/factory/cache.controller.abstract.factory.class";
import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";

export default class ArtistImageCacheControllerFactory extends CacheControllerAbstractFactory<string> {
  protected OriginServerPersistenceClient =
    persistenceVendorBackend.PersistenceClient;
  protected CdnClient = ArtistImageCdnClient;
  protected defaultResponse = "";

  protected getPartitionName(): string {
    return process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME;
  }

  protected getCdnHostname(): string {
    return process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME;
  }
}
