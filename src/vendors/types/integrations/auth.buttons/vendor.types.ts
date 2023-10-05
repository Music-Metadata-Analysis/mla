import type { AuthVendorServiceType } from "@src/vendors/types/integrations/auth/vendor.types";

export interface AuthButtonVendorComponentInterface {
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
  FacebookAuthButton: (
    props: AuthButtonVendorComponentInterface
  ) => JSX.Element;
  GithubAuthButton: (props: AuthButtonVendorComponentInterface) => JSX.Element;
  GoogleAuthButton: (props: AuthButtonVendorComponentInterface) => JSX.Element;
  SpotifyAuthButton: (props: AuthButtonVendorComponentInterface) => JSX.Element;
}
