import type { AuthVendorServiceType } from "@src/vendors/types/integrations/auth/vendor.types";

export interface AuthButtonInterface {
  callBack: (authServiceType: AuthVendorServiceType) => void;
  iconComponent?: ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => JSX.Element;
  text: string;
  width: number;
}

export interface AuthButtonVendorInterface {
  FacebookAuthButton: (props: AuthButtonInterface) => JSX.Element;
  GithubAuthButton: (props: AuthButtonInterface) => JSX.Element;
  GoogleAuthButton: (props: AuthButtonInterface) => JSX.Element;
  SpotifyAuthButton: (props: AuthButtonInterface) => JSX.Element;
}
