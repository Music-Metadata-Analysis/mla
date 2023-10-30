import LastFmAlbumClientAdapter from "../backend/client/album.class";
import LastFmArtistClientAdapter from "../backend/client/artist.class";
import LastFmTrackClientAdapter from "../backend/client/track.class";
import LastFmUserClientAdapter from "../backend/client/user.class";
import LastFMSignedClient from "../backend/signed.client/signed.client.class";
import { lastFMVendorBackend } from "../vendor.backend";

describe("lastFMVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(lastFMVendorBackend.AlbumClient).toBe(LastFmAlbumClientAdapter);
    expect(lastFMVendorBackend.ArtistClient).toBe(LastFmArtistClientAdapter);
    expect(lastFMVendorBackend.TrackClient).toBe(LastFmTrackClientAdapter);
    expect(lastFMVendorBackend.SignedClient).toBe(LastFMSignedClient);
    expect(lastFMVendorBackend.UserClient).toBe(LastFmUserClientAdapter);
    expect(Object.keys(lastFMVendorBackend).length).toBe(5);
  });
});
