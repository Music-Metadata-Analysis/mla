import ArtistImageScraper from "./artist.image.scraper.class";
import cacheVendor from "@src/backend/integrations/cache/vendor";
import type { PersistanceVendorInterface } from "@src/types/integrations/persistance/vendor.types";

export default class ArtistImageCdnClient extends cacheVendor.VendorCdnBaseClient<string> {
  protected scraper: ArtistImageScraper;
  protected cacheFolderName = "lastfm/artists";
  protected scraperRetries = 2;

  constructor(
    originServerClient: PersistanceVendorInterface,
    cdnHostname: string
  ) {
    super(originServerClient, cdnHostname);
    this.scraper = new ArtistImageScraper();
  }

  protected async createNewObject(objectName: string): Promise<string> {
    const newEntry = await this.scraper.getArtistImage(
      objectName,
      this.scraperRetries
    );
    return newEntry;
  }
  protected deserializeObjectForJavascript(serializedObject: string): string {
    return serializedObject;
  }

  protected serializeObjectForStorage(deserializedObject: string): string {
    return deserializedObject;
  }
}
