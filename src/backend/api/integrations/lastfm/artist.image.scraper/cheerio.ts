import * as cheerio from "cheerio";
import lastFMConfig from "@src/config/lastfm";
import type { LastFMVendorArtistImageScraperInterface } from "@src/backend/api/types/integrations/lastfm/vendor.types";

export default class CheerioArtistImageScraper
  implements LastFMVendorArtistImageScraperInterface
{
  protected targetCssClass = ".image-list-item";
  public defaultArtistImageResponse = "";
  public invalidResponseMessage = "Invalid Response!";
  public invalidHTMLMessage = "Invalid HTML!";

  public async scrape(
    artistName: string | undefined,
    retries: number
  ): Promise<string> {
    if (artistName) {
      const url = this.getArtistURL(artistName);
      return fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(this.invalidResponseMessage);
          }
          return response.text();
        })
        .then((html) => {
          return Promise.resolve(this.parseImageSource(html));
        })
        .catch(() => {
          if (retries > 0) return this.scrape(artistName, retries - 1);
          return this.defaultArtistImageResponse;
        });
    }
    return Promise.resolve(this.defaultArtistImageResponse);
  }

  protected getArtistURL(artistName: string): string {
    return (
      lastFMConfig.prefixPath +
      "/" +
      encodeURIComponent(artistName) +
      "/+images"
    );
  }

  protected parseImageSource(html: string): string {
    try {
      const page = cheerio.load(html);
      const image = (page(this.targetCssClass)[0] as cheerio.NodeWithChildren)
        .children[1] as cheerio.Element;
      return image.attribs.src
        ? image.attribs.src
        : this.defaultArtistImageResponse;
    } catch {
      throw new Error(this.invalidHTMLMessage);
    }
  }
}
