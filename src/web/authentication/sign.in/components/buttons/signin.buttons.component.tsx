import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import SpotifyLoginButton from "@src/components/button/button.spotify/button.spotify.component";
import AnalyticsButtonWrapper from "@src/web/analytics/collection/components/analytics.button/analytics.button.container";
import type { AuthVendorServiceType } from "@src/vendors/types/integrations/auth/vendor.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

export interface AuthenticationProviderProps {
  handleSignIn: (provider: AuthVendorServiceType) => void;
  t: tFunctionType;
}

export default function SignInButtons({
  handleSignIn,
  t,
}: AuthenticationProviderProps) {
  const buttonWidth = 245;

  return (
    <>
      <AnalyticsButtonWrapper buttonName={"Facebook Login"}>
        <FacebookLoginButton
          style={{ width: buttonWidth }}
          align={"center"}
          onClick={() => handleSignIn("facebook")}
          text={t("buttons.facebook")}
        />
      </AnalyticsButtonWrapper>
      <AnalyticsButtonWrapper buttonName={"Github Login"}>
        <GithubLoginButton
          style={{ width: buttonWidth }}
          align={"center"}
          onClick={() => handleSignIn("github")}
          text={t("buttons.github")}
        />
      </AnalyticsButtonWrapper>
      <AnalyticsButtonWrapper buttonName={"Google Login"}>
        <GoogleLoginButton
          style={{ width: buttonWidth }}
          align={"center"}
          onClick={() => handleSignIn("google")}
          text={t("buttons.google")}
        />
      </AnalyticsButtonWrapper>
      <AnalyticsButtonWrapper buttonName={"Spotify Login"}>
        <SpotifyLoginButton
          style={{ width: buttonWidth }}
          align={"center"}
          onClick={() => handleSignIn("spotify")}
          text={t("buttons.spotify")}
        />
      </AnalyticsButtonWrapper>
    </>
  );
}
