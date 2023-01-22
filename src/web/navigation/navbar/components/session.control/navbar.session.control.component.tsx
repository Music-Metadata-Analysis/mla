import { LockIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Authentication from "@src/components/authentication/authentication.container";
import useColour from "@src/hooks/ui/colour.hook";
import AnalyticsButtonWrapperContainer from "@src/web/analytics/collection/components/analytics.button/analytics.button.container";
import type { MouseEvent } from "react";

export interface NavSessionControlProps {
  analyticsButtonName: string;
  buttonType: "signIn" | "signOut";
  handleClick: (e: MouseEvent<HTMLElement>) => void;
  onAuthenticationModalClose: () => void;
  showAuthenticationModal: boolean;
}

const NavBarSessionControl = ({
  analyticsButtonName,
  buttonType,
  handleClick,
  onAuthenticationModalClose,
  showAuthenticationModal,
}: NavSessionControlProps) => {
  const { navButtonColour, transparent } = useColour();

  return (
    <>
      <Authentication
        hidden={!showAuthenticationModal}
        onModalClose={onAuthenticationModalClose}
      />
      <Box pl={[0, 2, 2]} pr={[0, 0.5]}>
        <AnalyticsButtonWrapperContainer buttonName={analyticsButtonName}>
          <Button
            onClick={handleClick}
            borderColor={transparent}
            width={"100%"}
            p={1}
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
        </AnalyticsButtonWrapperContainer>
      </Box>
    </>
  );
};

export default NavBarSessionControl;
