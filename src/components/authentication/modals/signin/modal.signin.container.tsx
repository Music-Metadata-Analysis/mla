import { useRef } from "react";
import AuthenticationSignInModal from "../signin/modal.signin.component";
import useLocale from "@src/hooks/locale";
import type { AuthServiceType } from "@src/types/clients/auth/vendor.types";

export interface AuthenticationSignInModalContainerProps {
  handleSignIn: (provider: AuthServiceType) => void;
  isOpen: boolean;
  onClose: (overrideCloseBehavior?: boolean) => void;
}

export default function AuthenticationSignInModalContainer({
  handleSignIn,
  isOpen,
  onClose,
}: AuthenticationSignInModalContainerProps) {
  const { t } = useLocale("authentication");
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <AuthenticationSignInModal
      authenticationT={t}
      isOpen={isOpen}
      onClose={onClose}
      scrollRef={scrollRef}
      handleSignIn={handleSignIn}
      titleText={t("title")}
      termsText={t("terms")}
    />
  );
}
