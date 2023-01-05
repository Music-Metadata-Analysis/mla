import CheerioArtistImageScraper from "./artist.image.scraper/cheerio";
import type { LastFMvendorInterface } from "@src/backend/api/types/integrations/lastfm/vendor.types";

const lastFMvendor: LastFMvendorInterface = {
  ArtistImageScraper: CheerioArtistImageScraper,
};

export default lastFMvendor;
