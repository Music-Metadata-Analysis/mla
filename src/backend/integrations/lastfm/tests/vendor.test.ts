import CheerioArtistImageScraper from "../artist.image.scraper/cheerio";
import lastFMvendor from "../vendor";

describe("lastFMvendor", () => {
  it("should be configured with the correct properties", () => {
    expect(lastFMvendor.ArtistImageScraper).toBe(CheerioArtistImageScraper);
  });
});
