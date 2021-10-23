import { useDisclosure } from "@chakra-ui/react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AuthenticationComponent from "./authentication.component";
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
  const { data: authSession, status: authStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isOpen && !hidden) {
      analytics.event(Events.Auth.OpenModal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, isOpen]);

  useEffect(() => {
    if (!authSession && !isOpen && authStatus === "unauthenticated") {
      onOpen();
    }
    if (authSession && isOpen && authStatus !== "unauthenticated") {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authSession, authStatus]);

  const handleClose = () => {
    analytics.event(Events.Auth.CloseModal);
    if (onModalClose) onModalClose();
    if (!onModalClose) router.back();
  };

  const handleSignIn = (provider: string) => {
    analytics.event(Events.Auth.HandleLogin(provider));
    signIn(provider);
  };

  if (hidden) return null;

  return (
    <AuthenticationComponent
      signIn={handleSignIn}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
}
