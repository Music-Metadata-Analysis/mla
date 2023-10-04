import lastFMplayCountByArtist from "./backend/lastfm/playcount.by.artist/validator";
import type { ApiValidationVendorBackendInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

export const apiValidationVendorBackend: ApiValidationVendorBackendInterface = {
  lastfm: {
    playCountByArtist: lastFMplayCountByArtist,
  },
};
