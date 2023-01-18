import { cacheVendorBackend } from "@src/vendors/integrations/cache/vendor.backend";
import { lastFMVendorBackend } from "@src/vendors/integrations/lastfm/vendor.backend";
import type { LastFMVendorArtistImageScraperInterface } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";
import type { PersistenceVendorClientInterface } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export default class ArtistImageCdnClient extends cacheVendorBackend.CdnBaseClient<string> {
  protected scraper: LastFMVendorArtistImageScraperInterface;
  protected cacheFolderName = "lastfm/artists";
  protected scraperRetries = 2;

  constructor(
    originServerClient: PersistenceVendorClientInterface,
    cdnHostname: string
  ) {
    super(originServerClient, cdnHostname);
    this.scraper = new lastFMVendorBackend.ArtistImageScraper();
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
