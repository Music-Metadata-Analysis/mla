import CheerioArtistImageScraper from "./backend/artist.image.scraper/cheerio";
import type { LastFMVendorBackendInterface } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

export const lastFMVendorBackend: LastFMVendorBackendInterface = {
  ArtistImageScraper: CheerioArtistImageScraper,
};
