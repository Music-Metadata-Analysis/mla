import { useRef } from "react";
import AuthenticationSignInModal from "../signin/modal.signin.component";
import useLocale from "@src/hooks/locale";
import type { AuthServiceType } from "@src/types/clients/auth/vendor.types";

export interface AuthenticationSignInModalContainerProps {
  isOpen: boolean;
  onClose: (overrideCloseBehavior?: boolean) => void;
  setClicked: (value: boolean) => void;
  signIn: (provider: AuthServiceType) => void;
}

export default function AuthenticationSignInModalContainer({
  isOpen,
  onClose,
  setClicked,
  signIn,
}: AuthenticationSignInModalContainerProps) {
  const { t } = useLocale("authentication");
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <AuthenticationSignInModal
      authenticationT={t}
      isOpen={isOpen}
      onClose={onClose}
      scrollRef={scrollRef}
      setClicked={setClicked}
      signIn={signIn}
      titleText={t("title")}
      termsText={t("terms")}
    />
  );
}
