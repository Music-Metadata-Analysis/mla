import type { VendorArtistImageScraperInterface } from "@src/backend/api/types/integrations/lastfm/vendor.types";

export const mockArtistImageScraper: VendorArtistImageScraperInterface = {
  defaultArtistImageResponse: "",
  invalidResponseMessage: "mockInvalidResponseMessage",
  invalidHTMLMessage: "mockInvalidHTMLMessage",
  scrape: jest.fn(),
};
