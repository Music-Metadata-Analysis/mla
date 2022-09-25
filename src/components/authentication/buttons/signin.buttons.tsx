import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import AnalyticsWrapper from "@src/components/analytics/analytics.button/analytics.button.component";
import SpotifyLoginButton from "@src/components/button/button.spotify/spotify.login";
import type { AuthServiceType } from "@src/types/clients/auth/vendor.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export interface AuthenticationProviderProps {
  setClicked: (value: boolean) => void;
  signIn: (provider: AuthServiceType) => void;
  t: tFunctionType;
}

export default function SignInButtons({
  setClicked,
  signIn,
  t,
}: AuthenticationProviderProps) {
  const buttonWidth = 245;

  const handleSignIn = (provider: AuthServiceType) => {
    setClicked(true);
    signIn(provider);
  };

  return (
    <>
      <AnalyticsWrapper buttonName={"Facebook Login"}>
        <FacebookLoginButton
          style={{ width: buttonWidth }}
          align={"center"}
          onClick={() => handleSignIn("facebook")}
          text={t("buttons.facebook")}
        />
      </AnalyticsWrapper>
      <AnalyticsWrapper buttonName={"Github Login"}>
        <GithubLoginButton
          style={{ width: buttonWidth }}
          align={"center"}
          onClick={() => handleSignIn("github")}
          text={t("buttons.github")}
        />
      </AnalyticsWrapper>
      <AnalyticsWrapper buttonName={"Google Login"}>
        <GoogleLoginButton
          style={{ width: buttonWidth }}
          align={"center"}
          onClick={() => handleSignIn("google")}
          text={t("buttons.google")}
        />
      </AnalyticsWrapper>
      <AnalyticsWrapper buttonName={"Spotify Login"}>
        <SpotifyLoginButton
          style={{ width: buttonWidth }}
          align={"center"}
          onClick={() => handleSignIn("spotify")}
          text={t("buttons.spotify")}
        />
      </AnalyticsWrapper>
    </>
  );
}
