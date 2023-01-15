import { useEffect, useState } from "react";
import NavSessionControl from "./navbar.session.control.component";
import useAuth from "@src/hooks/auth.hook";
import useToggle from "@src/utilities/react/hooks/toggle.hook";
import type { MouseEvent } from "react";

export interface NavSessionControlContainerProps {
  closeMobileMenu: () => void;
}

const NavBarSessionControlContainer = ({
  closeMobileMenu,
}: NavSessionControlContainerProps) => {
  const authentication = useAuth();
  const authenticationModal = useToggle();
  const [controlButtonType, setControlButtonType] =
    useState<keyof typeof operations>("signIn");

  useEffect(() => {
    return () => authenticationModal.setFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authentication.status === "unauthenticated") {
      setControlButtonType("signIn");
    } else {
      setControlButtonType("signOut");
    }
  }, [authentication.status]);

  const generateAnalyticsName = () => {
    const name =
      controlButtonType[0].toUpperCase() + controlButtonType.slice(1);
    return `NavBar ${name}`;
  };

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.blur();
    closeMobileMenu();
    operations[controlButtonType]();
  };

  const operations = {
    signIn: authenticationModal.setTrue,
    signOut: authentication.signOut,
  };

  return (
    <NavSessionControl
      analyticsButtonName={generateAnalyticsName()}
      buttonType={controlButtonType}
      handleClick={handleClick}
      onAuthenticationModalClose={authenticationModal.setFalse}
      showAuthenticationModal={authenticationModal.state}
    />
  );
};

export default NavBarSessionControlContainer;
