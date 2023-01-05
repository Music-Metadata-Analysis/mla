export interface VendorArtistImageScraperInterface {
  defaultArtistImageResponse: string;
  invalidResponseMessage: string;
  invalidHTMLMessage: string;
  scrape(
    artistName: string | undefined,
    retries: number
  ): Promise<string> | string;
}

export interface LastFMvendorInterface {
  ArtistImageScraper: new () => VendorArtistImageScraperInterface;
}
