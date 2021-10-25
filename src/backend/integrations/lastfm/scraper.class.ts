import * as cheerio from "cheerio";
import lastFMConfig from "../../../config/lastfm";

export default class Scraper {
  defaultArtistImageResponse = "";
  invalidResponseMessage = "Invalid Response!";
  invalidHTMLMessage = "Invalid HTML!";
  targetCssClass = ".image-list-item";

  async getArtistImage(
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
          return Promise.resolve(this.parseLastFMImage(html));
        })
        .catch(() => {
          if (retries > 0) return this.getArtistImage(artistName, retries - 1);
          return this.defaultArtistImageResponse;
        });
    }
    return Promise.resolve(this.defaultArtistImageResponse);
  }

  private getArtistURL(artistName: string) {
    return (
      lastFMConfig.prefixPath +
      "/" +
      encodeURIComponent(artistName) +
      "/+images"
    );
  }

  private parseLastFMImage(html: string) {
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
