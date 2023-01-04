import cacheVendor from "@src/backend/api/integrations/cache/vendor";
import lastFMvendor from "@src/backend/api/integrations/lastfm/vendor";
import type { PersistenceVendorClientInterface } from "@src/backend/api/types/integrations/persistence/vendor.types";
import type { VendorArtistImageScraperInterface } from "@src/types/integrations/lastfm/vendor.types";

export default class ArtistImageCdnClient extends cacheVendor.CdnBaseClient<string> {
  protected scraper: VendorArtistImageScraperInterface;
  protected cacheFolderName = "lastfm/artists";
  protected scraperRetries = 2;

  constructor(
    originServerClient: PersistenceVendorClientInterface,
    cdnHostname: string
  ) {
    super(originServerClient, cdnHostname);
    this.scraper = new lastFMvendor.ArtistImageScraper();
  }

  protected async createNewObject(objectName: string): Promise<string> {
    const newEntry = await this.scraper.scrape(objectName, this.scraperRetries);
    return newEntry;
  }
  protected deserializeObjectForJavascript(serializedObject: string): string {
    return serializedObject;
  }

  protected serializeObjectForStorage(deserializedObject: string): string {
    return deserializedObject;
  }
}
