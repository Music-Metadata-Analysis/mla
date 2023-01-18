import { mockArtistImageScraper } from "./vendor.backend.mock";
import type { LastFMVendorBackendInterface } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

export const lastFMVendorBackend: LastFMVendorBackendInterface = {
  ArtistImageScraper: jest.fn(() => mockArtistImageScraper),
};
