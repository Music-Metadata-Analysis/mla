import { createButton, createSvgIcon } from "react-social-login-buttons";
import type { AuthButtonVendorComponentInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export const LastFMAuthButtonError = new Error(
  "LastFMAuthButton requires an iconComponent!"
);

export default function LastFMAuthButton({
  callBack,
  iconComponent,
  text,
  width,
}: AuthButtonVendorComponentInterface) {
  if (!iconComponent) throw LastFMAuthButtonError;

  const config = {
    activeStyle: { background: "#8F0000" },
    icon: createSvgIcon(() => iconComponent()),
    style: { background: "#7F0000", color: "white" },
    text,
  };

  const LastFMButton = createButton(config);

  return (
    <LastFMButton
      align={"center"}
      onClick={() => callBack("lastfm")}
      style={{ width: `${width}px` }}
      text={text}
    />
  );
}
