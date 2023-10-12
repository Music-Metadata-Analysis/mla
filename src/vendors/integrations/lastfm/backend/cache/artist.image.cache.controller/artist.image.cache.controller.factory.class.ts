import ArtistImageCdnClient from "./cdn/artist.image.cdn.client.class";
import { cacheVendorBackend } from "@src/vendors/integrations/cache/vendor.backend";
import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";

export default class ArtistImageCacheControllerFactory extends cacheVendorBackend.CdnControllerAbstractFactory<string> {
  protected OriginServerPersistenceClientClass =
    persistenceVendorBackend.PersistenceClient;
  protected CdnClientClass = ArtistImageCdnClient;
  protected defaultResponse = "";

  protected getPartitionName(): string {
    return process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME;
  }

  protected getCdnHostname(): string {
    return process.env.LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME;
  }
}
