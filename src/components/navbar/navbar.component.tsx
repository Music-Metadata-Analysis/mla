import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useContext } from "react";
import NavBarColorModeToggle from "./navbar.color.mode/navbar.color.mode.component";
import NavBarLogo from "./navbar.logo/navbar.logo.component";
import NavBarOptions from "./navbar.options/navbar.options.component";
import NavBarSessionControl from "./navbar.session.control/navbar.session.control.component";
import Spinner from "./navbar.spinner/navbar.spinner.component";
import lastFMSettings from "../../config/lastfm";
import useColour from "../../hooks/colour";
import useLastFM from "../../hooks/lastfm";
import { NavBarContext } from "../../providers/navbar/navbar.provider";
import UserBaseState from "../../providers/user/encapsulations/lastfm/user.state.base.class";
import Condition from "../condition/condition.component";

export const testIDs = {
  NavBarRoot: "NavBarRoot",
  NavBarMenu: "NavBarMenu",
  NavBarMobileMenu: "NavBarMobileMenu",
  NavBarMobileMenuButton: "NavBarMobileMenuButton",
};

interface NavBarProps {
  menuConfig: { [index: string]: string };
}

export default function NavBar({ menuConfig }: NavBarProps) {
  const { componentColour, transparent } = useColour();
  const { isVisible } = useContext(NavBarContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useLastFM();
  const userState = new UserBaseState(user.userProperties);

  const getProfileUrl = () => {
    if (user.userProperties.profileUrl) return user.userProperties.profileUrl;
    return lastFMSettings.homePage;
  };

  useEffect(() => {
    if (!user.userProperties.ready) onClose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userProperties.ready]);

  if (!isVisible) return null;

  return (
    <>
      <Box
        zIndex={100}
        fontSize={[18, 18, 20]}
        style={{ position: "fixed", top: 0, width: "100%" }}
        data-testid={testIDs.NavBarRoot}
        bg={componentColour.background}
        color={componentColour.foreground}
        borderColor={componentColour.border}
        px={4}
        sx={{
          caretColor: transparent,
        }}
        borderBottomWidth={"1px"}
        borderBottomStyle={"solid"}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <NavBarLogo
            href={getProfileUrl()}
            image={userState.getProfileImageUrl("small")}
          />
          <Spinner whileTrue={!user.userProperties.ready}>
            <Flex
              data-testid={testIDs.NavBarMenu}
              h={16}
              alignItems={"center"}
              justifyContent={"flex-end"}
            >
              <NavBarColorModeToggle />
              <NavBarSessionControl />
              <IconButton
                ml={1}
                data-testid={testIDs.NavBarMobileMenuButton}
                size={"md"}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={"Open Menu"}
                display={{ sm: "none" }}
                onClick={isOpen ? onClose : onOpen}
              />
              <HStack spacing={8} alignItems={"center"}>
                <HStack
                  as={"nav"}
                  spacing={2}
                  display={{ base: "none", sm: "flex" }}
                >
                  <NavBarOptions menuConfig={menuConfig} />
                </HStack>
              </HStack>
            </Flex>
          </Spinner>
        </Flex>
        <Condition isTrue={isOpen}>
          <Box
            data-testid={testIDs.NavBarMobileMenu}
            pb={4}
            display={{ sm: "none" }}
          >
            <Stack as={"nav"} spacing={4}>
              <div onClick={onClose}>
                <NavBarOptions menuConfig={menuConfig} />
              </div>
            </Stack>
          </Box>
        </Condition>
      </Box>
    </>
  );
}
