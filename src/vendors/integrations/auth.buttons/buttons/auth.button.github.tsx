import { GithubLoginButton } from "react-social-login-buttons";
import type { AuthButtonInterface } from "@src/vendors/types/integrations/auth.buttons/vendor.types";

export default function GithubAuthButton({
  width,
  text,
  callBack,
}: AuthButtonInterface) {
  return (
    <GithubLoginButton
      align={"center"}
      onClick={() => callBack("github")}
      style={{ width: `${width}px` }}
      text={text}
    />
  );
}
