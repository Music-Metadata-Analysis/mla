import lastFMplayCountByArtist from "../backend/lastfm/playcount.by.artist/validator";
import { apiValidationVendorBackend } from "../vendor.backend";

describe("apiValidationVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(apiValidationVendorBackend.lastfm.playCountByArtist).toBe(
      lastFMplayCountByArtist
    );
    expect(apiValidationVendorBackend["last.fm"].playCountByArtist).toBe(
      lastFMplayCountByArtist
    );
    expect(Object.keys(apiValidationVendorBackend).length).toBe(2);
    expect(Object.keys(apiValidationVendorBackend.lastfm).length).toBe(1);
    expect(Object.keys(apiValidationVendorBackend["last.fm"]).length).toBe(1);
  });
});
