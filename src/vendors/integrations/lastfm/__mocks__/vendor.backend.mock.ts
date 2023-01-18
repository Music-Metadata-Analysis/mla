import type { LastFMVendorArtistImageScraperInterface } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

export const mockArtistImageScraper: LastFMVendorArtistImageScraperInterface = {
  defaultArtistImageResponse: "",
  invalidResponseMessage: "mockInvalidResponseMessage",
  invalidHTMLMessage: "mockInvalidHTMLMessage",
  scrape: jest.fn(),
};
