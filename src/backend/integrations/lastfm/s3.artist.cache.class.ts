import Scraper from "./scraper.class";
import S3BaseCache from "../s3/s3.base.cache.class";

export default class S3ArtistCache extends S3BaseCache<string> {
  scraper: Scraper;
  cacheFolderName = "lastfm/artists";
  cacheContentType = "text/plain";
  defaultResponse = "";
  scraperRetries = 2;

  constructor(bucketName: string) {
    super(bucketName);
    this.scraper = new Scraper();
  }

  stringifyObject(newEntry: string): string {
    return newEntry;
  }

  async getResponseValue(response: Response) {
    return response.text();
  }

  async createEntry(objectName: string): Promise<string> {
    const newEntry = await this.scraper.getArtistImage(
      objectName,
      this.scraperRetries
    );
    return newEntry;
  }
}
