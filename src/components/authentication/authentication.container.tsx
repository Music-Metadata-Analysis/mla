import { useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SignInModal from "./modals/modal.signin.component";
import SpinnerModal from "./modals/modal.spinner.component";
import routes from "../../config/routes";
import Events from "../../events/events";
import useAnalytics from "../../hooks/analytics";
import useAuth from "../../hooks/auth";
import type { AuthServiceType } from "../../types/clients/auth/vendor.types";

export interface AuthenticationProps {
  onModalClose?: () => void;
  hidden?: boolean;
}

export default function Authentication({
  hidden = false,
  onModalClose = undefined,
}: AuthenticationProps) {
  const analytics = useAnalytics();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status: authStatus, signIn } = useAuth();
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (isOpen && !hidden) {
      analytics.event(Events.Auth.OpenModal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, isOpen]);

  useEffect(() => {
    if (!isOpen && authStatus === "unauthenticated") {
      onOpen();
    }
    if (authStatus !== "unauthenticated") {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  const handleClose = (overrideCloseBehavior = false) => {
    analytics.event(Events.Auth.CloseModal);
    if (onModalClose) onModalClose();
    if (!onModalClose && !overrideCloseBehavior) router.push(routes.home);
  };

  const handleSignIn = (provider: AuthServiceType) => {
    analytics.event(Events.Auth.HandleLogin(provider));
    signIn(provider);
  };

  if (hidden) return null;

  if (clicked) return <SpinnerModal onClose={onClose} />;

  return (
    <SignInModal
      signIn={handleSignIn}
      isOpen={isOpen}
      onClose={handleClose}
      setClicked={setClicked}
    />
  );
}
