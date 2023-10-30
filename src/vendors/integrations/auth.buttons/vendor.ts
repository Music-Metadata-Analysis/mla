import FacebookAuthButton from "./buttons/auth.button.facebook";
import GithubAuthButton from "./buttons/auth.button.github";
import GoogleAuthButton from "./buttons/auth.button.google";
import LastFMAuthButton from "./buttons/auth.button.lastfm";
import SpotifyAuthButton from "./buttons/auth.button.spotify";
import type { AuthButtonVendorInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export const authButtonVendor: AuthButtonVendorInterface = {
  FacebookAuthButton,
  GithubAuthButton,
  GoogleAuthButton,
  LastFMAuthButton,
  SpotifyAuthButton,
};
