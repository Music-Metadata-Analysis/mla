import CheerioArtistImageScraper from "../backend/artist.image.scraper/cheerio";
import { lastFMVendorBackend } from "../vendor.backend";

describe("lastFMVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(lastFMVendorBackend.ArtistImageScraper).toBe(
      CheerioArtistImageScraper
    );
  });
});
