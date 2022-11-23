import { useEffect, useState } from "react";
import SignInModalContainer from "./modals/signin/modal.signin.container";
import SpinnerModalContainer from "./modals/spinner/modal.spinner.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useAnalytics from "@src/hooks/analytics";
import useAuth from "@src/hooks/auth";
import useRouter from "@src/hooks/router";
import useToggle from "@src/hooks/utility/toggle.hook";
import type { AuthServiceType } from "@src/types/clients/auth/vendor.types";

export interface AuthenticationProps {
  onModalClose?: () => void;
  hidden?: boolean;
}

export default function Authentication({
  hidden = false,
  onModalClose = undefined,
}: AuthenticationProps) {
  const analytics = useAnalytics();
  const modalToggle = useToggle();
  const { status: authStatus, signIn } = useAuth();
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (modalToggle.state && !hidden) {
      analytics.event(Events.Auth.OpenModal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, modalToggle.state]);

  useEffect(() => {
    if (!modalToggle.state && authStatus === "unauthenticated") {
      modalToggle.setTrue();
    }
    if (authStatus !== "unauthenticated") {
      modalToggle.setFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  const handleClose = (overrideCloseBehavior = false) => {
    analytics.event(Events.Auth.CloseModal);
    if (onModalClose) onModalClose();
    if (!onModalClose && !overrideCloseBehavior) router.push(routes.home);
  };

  const handleSignIn = (provider: AuthServiceType) => {
    setClicked(true);
    analytics.event(Events.Auth.HandleLogin(provider));
    signIn(provider);
  };

  if (hidden) return null;

  if (clicked) return <SpinnerModalContainer onClose={modalToggle.setFalse} />;

  return (
    <SignInModalContainer
      handleSignIn={handleSignIn}
      isOpen={modalToggle.state}
      onClose={handleClose}
    />
  );
}
