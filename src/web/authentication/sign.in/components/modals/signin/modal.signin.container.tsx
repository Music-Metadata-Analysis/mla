import { useRef } from "react";
import AuthenticationSignInModal from "./modal.signin.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import type { AuthVendorServiceType } from "@src/vendors/types/integrations/auth/vendor.types";

export interface AuthenticationSignInModalContainerProps {
  handleSignIn: (provider: AuthVendorServiceType) => void;
  isOpen: boolean;
  onClose: (overrideCloseBehavior?: boolean) => void;
}

export default function AuthenticationSignInModalContainer({
  handleSignIn,
  isOpen,
  onClose,
}: AuthenticationSignInModalContainerProps) {
  const { t } = useTranslation("authentication");
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
