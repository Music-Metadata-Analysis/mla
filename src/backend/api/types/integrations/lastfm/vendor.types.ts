export interface LastFMVendorArtistImageScraperInterface {
  defaultArtistImageResponse: string;
  invalidResponseMessage: string;
  invalidHTMLMessage: string;
  scrape(
    artistName: string | undefined,
    retries: number
  ): Promise<string> | string;
}

export interface LastFMVendorInterface {
  ArtistImageScraper: new () => LastFMVendorArtistImageScraperInterface;
}

export interface LastFMVendorClientError extends Error {
  statusCode: number;
}
