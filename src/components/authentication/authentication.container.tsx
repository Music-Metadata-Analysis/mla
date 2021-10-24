import { useDisclosure } from "@chakra-ui/react";
import { useSession, signIn, RedirectableProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SignInModal from "./modals/modal.signin.component";
import SpinnerModal from "./modals/modal.spinner.component";
import Events from "../../events/events";
import useAnalytics from "../../hooks/analytics";

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
  const { status: authStatus } = useSession({ required: false });
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

  const handleClose = () => {
    analytics.event(Events.Auth.CloseModal);
    if (onModalClose) onModalClose();
    if (!onModalClose) router.back();
  };

  const handleSignIn = (provider: string) => {
    analytics.event(Events.Auth.HandleLogin(provider));
    signIn(provider as RedirectableProvider);
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
