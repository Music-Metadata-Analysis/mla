import { createButton, createSvgIcon } from "react-social-login-buttons";
import type { AuthButtonVendorComponentInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export const SpotifyAuthButtonError = new Error(
  "SpotifyAuthButton requires an iconComponent!"
);

export default function SpotifyAuthButton({
  callBack,
  iconComponent,
  text,
  width,
}: AuthButtonVendorComponentInterface) {
  if (!iconComponent) throw SpotifyAuthButtonError;

  const config = {
    activeStyle: { background: "#1f1f1f" },
    icon: createSvgIcon(() => iconComponent()),
    style: { background: "#0a0a0a", color: "white" },
    text,
  };

  const SpotifyLoginButton = createButton(config);

  return (
    <SpotifyLoginButton
      align={"center"}
      onClick={() => callBack("spotify")}
      style={{ width: `${width}px` }}
      text={text}
    />
  );
}
