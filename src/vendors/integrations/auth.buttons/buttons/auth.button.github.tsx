import { GithubLoginButton } from "react-social-login-buttons";
import type { AuthButtonVendorComponentInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export default function GithubAuthButton({
  width,
  text,
  callBack,
}: AuthButtonVendorComponentInterface) {
  return (
    <GithubLoginButton
      align={"center"}
      onClick={() => callBack("github")}
      style={{ width: `${width}px` }}
      text={text}
    />
  );
}
