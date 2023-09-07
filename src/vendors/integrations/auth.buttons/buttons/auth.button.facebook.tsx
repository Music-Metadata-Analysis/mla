import { FacebookLoginButton } from "react-social-login-buttons";
import type { AuthButtonInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export default function FacebookAuthButton({
  width,
  text,
  callBack,
}: AuthButtonInterface) {
  return (
    <FacebookLoginButton
      align={"center"}
      onClick={() => callBack("facebook")}
      style={{ width: `${width}px` }}
      text={text}
    />
  );
}
