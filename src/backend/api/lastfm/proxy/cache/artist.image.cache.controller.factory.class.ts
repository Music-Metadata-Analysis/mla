import ArtistImageCdnClient from "./cdn/artist.image.cdn.client.class";
import CacheControllerAbstractFactory from "@src/backend/cache/factory/cache.controller.abstract.factory.class";
import persistanceVendor from "@src/backend/integrations/persistance/vendor";

export default class ArtistImageCacheControllerFactory extends CacheControllerAbstractFactory<string> {
  protected OriginServerPersistanceClient = persistanceVendor.PersistanceClient;
  protected CdnClient = ArtistImageCdnClient;
  protected defaultResponse = "";

  protected getPartitionName(): string {
    return process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME;
  }

  protected getCdnHostname(): string {
    return process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME;
  }
}
