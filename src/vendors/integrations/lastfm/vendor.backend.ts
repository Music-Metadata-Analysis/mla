import LastFmAlbumClientAdapter from "./backend/client/album.class";
import LastFmArtistClientAdapter from "./backend/client/artist.class";
import LastFmTrackClientAdapter from "./backend/client/track.class";
import LastFmUserClientAdapter from "./backend/client/user.class";
import type { LastFMVendorBackendInterface } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

export const lastFMVendorBackend: LastFMVendorBackendInterface = {
  AlbumClient: LastFmAlbumClientAdapter,
  ArtistClient: LastFmArtistClientAdapter,
  TrackClient: LastFmTrackClientAdapter,
  UserClient: LastFmUserClientAdapter,
};
