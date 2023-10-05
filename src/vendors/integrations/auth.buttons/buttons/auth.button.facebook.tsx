import { FacebookLoginButton } from "react-social-login-buttons";
import type { AuthButtonVendorComponentInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export default function FacebookAuthButton({
  width,
  text,
  callBack,
}: AuthButtonVendorComponentInterface) {
  return (
    <FacebookLoginButton
      align={"center"}
      onClick={() => callBack("facebook")}
      style={{ width: `${width}px` }}
      text={text}
    />
  );
}
