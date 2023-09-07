import {
  mockFacebookAuthButton,
  mockGithubAuthButton,
  mockGoogleAuthButton,
  mockSpotifyAuthButton,
} from "./vendor.mock";
import type { AuthButtonVendorInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export const authButtonVendor: AuthButtonVendorInterface = {
  FacebookAuthButton: mockFacebookAuthButton,
  GithubAuthButton: mockGithubAuthButton,
  GoogleAuthButton: mockGoogleAuthButton,
  SpotifyAuthButton: mockSpotifyAuthButton,
};
