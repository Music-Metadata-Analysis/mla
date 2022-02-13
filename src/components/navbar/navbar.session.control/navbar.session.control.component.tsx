import { LockIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import useColour from "../../../hooks/colour";
import AnalyticsWrapper from "../../analytics/analytics.button/analytics.button.component";
import Authentication from "../../authentication/authentication.container";
import type { MouseEvent } from "react";

const NavSessionControl = () => {
  const { navButtonColour, transparent } = useColour();
  const { status: authStatus } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [buttonType, setButtonType] =
    useState<keyof typeof operations>("signIn");

  const operations = {
    signIn: () => {
      setShowModal(true);
    },
    signOut: () => {
      signOut();
    },
  };

  useEffect(() => {
    return () => setShowModal(false);
  }, []);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      setButtonType("signIn");
    } else {
      setButtonType("signOut");
    }
  }, [authStatus]);

  const handleOperation = (e: MouseEvent<HTMLElement>) => {
    operations[buttonType]();
    e.currentTarget.blur();
  };

  const generateAnalyticsName = () => {
    const name = buttonType[0].toUpperCase() + buttonType.slice(1);
    return `NavBar ${name}`;
  };

  return (
    <>
      <Authentication
        hidden={!showModal}
        onModalClose={() => setShowModal(false)}
      />
      <Box pl={[0, 2]} pr={2}>
        <AnalyticsWrapper buttonName={generateAnalyticsName()}>
          <Button
            onClick={(e) => {
              handleOperation(e);
            }}
            borderColor={transparent}
            width={"100%"}
            p={"10px"}
            rounded={"md"}
            _hover={{
              textDecoration: "none",
              bg: navButtonColour.hoverBackground,
            }}
            bg={navButtonColour.background}
          >
            {buttonType === "signIn" ? (
              <LockIcon data-testid={buttonType} w={5} h={5} />
            ) : (
              <RiLogoutBoxRLine size={20} data-testid={buttonType} />
            )}
          </Button>
        </AnalyticsWrapper>
      </Box>
    </>
  );
};

export default NavSessionControl;
