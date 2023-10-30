import {
  mockFacebookAuthButton,
  mockGithubAuthButton,
  mockGoogleAuthButton,
  mockLastFMAuthButton,
  mockSpotifyAuthButton,
} from "./vendor.mock";
import type { AuthButtonVendorInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export const authButtonVendor: AuthButtonVendorInterface = {
  FacebookAuthButton: mockFacebookAuthButton,
  GithubAuthButton: mockGithubAuthButton,
  GoogleAuthButton: mockGoogleAuthButton,
  LastFMAuthButton: mockLastFMAuthButton,
  SpotifyAuthButton: mockSpotifyAuthButton,
};
