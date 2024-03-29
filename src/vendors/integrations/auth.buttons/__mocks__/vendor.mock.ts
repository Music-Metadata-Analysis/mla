import { createSimpleComponent } from "@fixtures/react/simple";
import type { AuthButtonVendorInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export const mockFacebookAuthButton = createSimpleComponent(
  "FacebookAuthButton"
) as unknown as AuthButtonVendorInterface["FacebookAuthButton"];
export const mockGithubAuthButton = createSimpleComponent(
  "GithubAuthButton"
) as unknown as AuthButtonVendorInterface["GithubAuthButton"];
export const mockGoogleAuthButton = createSimpleComponent(
  "GoogleAuthButton"
) as unknown as AuthButtonVendorInterface["GoogleAuthButton"];
export const mockLastFMAuthButton = createSimpleComponent(
  "LastFMAuthButton"
) as unknown as AuthButtonVendorInterface["LastFMAuthButton"];
export const mockSpotifyAuthButton = createSimpleComponent(
  "SpotifyAuthButton"
) as unknown as AuthButtonVendorInterface["SpotifyAuthButton"];
