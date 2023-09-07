import { GoogleLoginButton } from "react-social-login-buttons";
import type { AuthButtonInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export default function GoogleAuthButton({
  width,
  text,
  callBack,
}: AuthButtonInterface) {
  return (
    <GoogleLoginButton
      align={"center"}
      onClick={() => callBack("google")}
      style={{ width: `${width}px` }}
      text={text}
    />
  );
}
