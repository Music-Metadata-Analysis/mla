import { authButtonVendor } from "@src/vendors/integrations/auth.buttons/vendor";
import AnalyticsButtonWrapper from "@src/web/analytics/collection/components/analytics.button/analytics.button.container";
import LastFMIconContainer from "@src/web/ui/generics/components/icons/lastfm/lastfm.icon.container";
import SpotifyIconContainer from "@src/web/ui/generics/components/icons/spotify/spotify.icon.container";
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
        <authButtonVendor.FacebookAuthButton
          callBack={handleSignIn}
          text={t("buttons.facebook")}
          width={buttonWidth}
        />
      </AnalyticsButtonWrapper>
      <AnalyticsButtonWrapper buttonName={"Github Login"}>
        <authButtonVendor.GithubAuthButton
          callBack={handleSignIn}
          text={t("buttons.github")}
          width={buttonWidth}
        />
      </AnalyticsButtonWrapper>
      <AnalyticsButtonWrapper buttonName={"Google Login"}>
        <authButtonVendor.GoogleAuthButton
          callBack={handleSignIn}
          text={t("buttons.google")}
          width={buttonWidth}
        />
      </AnalyticsButtonWrapper>
      <AnalyticsButtonWrapper buttonName={"LastFM Login"}>
        <authButtonVendor.LastFMAuthButton
          callBack={handleSignIn}
          iconComponent={() => LastFMIconContainer({ width: 26, height: 26 })}
          text={t("buttons.lastfm")}
          width={buttonWidth}
        />
      </AnalyticsButtonWrapper>
      <AnalyticsButtonWrapper buttonName={"Spotify Login"}>
        <authButtonVendor.SpotifyAuthButton
          callBack={handleSignIn}
          iconComponent={SpotifyIconContainer}
          text={t("buttons.spotify")}
          width={buttonWidth}
        />
      </AnalyticsButtonWrapper>
    </>
  );
}
