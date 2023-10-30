import LastFmAlbumClientAdapter from "../backend/client/album.class";
import LastFmArtistClientAdapter from "../backend/client/artist.class";
import LastFmTrackClientAdapter from "../backend/client/track.class";
import LastFmUserClientAdapter from "../backend/client/user.class";
import LastFMSignedClient from "../backend/signed.client/signed.client.class";
import type { LastFMVendorBackendInterface } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

jest.mock("../backend/client/album.class");
jest.mock("../backend/client/artist.class");
jest.mock("../backend/client/track.class");
jest.mock("../backend/signed.client/signed.client.class");
jest.mock("../backend/client/user.class");

export const lastFMVendorBackend: LastFMVendorBackendInterface = {
  AlbumClient: LastFmAlbumClientAdapter,
  ArtistClient: LastFmArtistClientAdapter,
  TrackClient: LastFmTrackClientAdapter,
  SignedClient: LastFMSignedClient,
  UserClient: LastFmUserClientAdapter,
};
