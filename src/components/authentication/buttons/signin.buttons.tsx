import {
  FacebookLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";
import AnalyticsWrapper from "../../analytics/analytics.button/analytics.button.component";
import SpotifyLoginButton from "../../button/button.spotify/spotify.login";
import type { TFunction } from "next-i18next";

export interface AuthenticationProviderProps {
  setClicked: (value: boolean) => void;
  signIn: (provider: string) => void;
  t: TFunction;
}

export default function SignInButtons({
  setClicked,
  signIn,
  t,
}: AuthenticationProviderProps) {
  const buttonWidth = 250;

  const handleSignIn = (provider: string) => {
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
