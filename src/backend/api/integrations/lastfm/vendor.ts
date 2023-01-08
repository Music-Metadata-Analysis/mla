import CheerioArtistImageScraper from "./artist.image.scraper/cheerio";
import type { LastFMVendorInterface } from "@src/backend/api/types/integrations/lastfm/vendor.types";

const lastFMvendor: LastFMVendorInterface = {
  ArtistImageScraper: CheerioArtistImageScraper,
};

export default lastFMvendor;
