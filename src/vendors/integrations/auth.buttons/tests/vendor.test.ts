import FacebookAuthButton from "../buttons/auth.button.facebook";
import GithubAuthButton from "../buttons/auth.button.github";
import GoogleAuthButton from "../buttons/auth.button.google";
import LastFMAuthButton from "../buttons/auth.button.lastfm";
import SpotifyAuthButton from "../buttons/auth.button.spotify";
import { authButtonVendor } from "../vendor";

describe("authButtonVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(authButtonVendor.FacebookAuthButton).toBe(FacebookAuthButton);
    expect(authButtonVendor.GithubAuthButton).toBe(GithubAuthButton);
    expect(authButtonVendor.GoogleAuthButton).toBe(GoogleAuthButton);
    expect(authButtonVendor.LastFMAuthButton).toBe(LastFMAuthButton);
    expect(authButtonVendor.SpotifyAuthButton).toBe(SpotifyAuthButton);
    expect(Object.keys(authButtonVendor).length).toBe(5);
  });
});
