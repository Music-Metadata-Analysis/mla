import ArtistImageCdnClient from "./artist.image.cdn.client.class";
import cacheVendor from "../../cache/vendor";
import persistanceVendor from "../../persistance/vendor";

export default class ArtistImageCacheControllerFactory extends cacheVendor.ControllerBaseFactory<string> {
  protected OriginServerPersistanceClient = persistanceVendor.PersistanceClient;
  protected CdnClient = ArtistImageCdnClient;
  protected defaultResponse = "";

  getPartitionName(): string {
    return process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME;
  }

  getCdnHostname(): string {
    return process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME;
  }
}