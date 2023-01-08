import { mockArtistImageScraper } from "./vendor.mock";
import type { LastFMVendorInterface } from "@src/backend/api/types/integrations/lastfm/vendor.types";

const lastFMvendor: LastFMVendorInterface = {
  ArtistImageScraper: jest.fn(() => mockArtistImageScraper),
};

export default lastFMvendor;
