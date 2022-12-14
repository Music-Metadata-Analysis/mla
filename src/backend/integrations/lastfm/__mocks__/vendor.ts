import { mockArtistImageScraper } from "./vendor.mock";
import type { LastFMvendorInterface } from "@src/types/integrations/lastfm/vendor.types";

const lastFMvendor: LastFMvendorInterface = {
  ArtistImageScraper: jest.fn(() => mockArtistImageScraper),
};

export default lastFMvendor;
