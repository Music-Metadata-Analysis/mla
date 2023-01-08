import type { LastFMVendorArtistImageScraperInterface } from "@src/backend/api/types/integrations/lastfm/vendor.types";

export const mockArtistImageScraper: LastFMVendorArtistImageScraperInterface = {
  defaultArtistImageResponse: "",
  invalidResponseMessage: "mockInvalidResponseMessage",
  invalidHTMLMessage: "mockInvalidHTMLMessage",
  scrape: jest.fn(),
};
