import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import NavBarColorModeToggle from "./navbar.color.mode/navbar.color.mode.component";
import NavBarLogo from "./navbar.logo/navbar.logo.component";
import NavBarOptions from "./navbar.options/navbar.options.component";
import NavBarSessionControl from "./navbar.session.control/navbar.session.control.component";
import Spinner from "./navbar.spinner/navbar.spinner.component";
import Condition from "@src/components/condition/condition.component";
import useColour from "@src/hooks/colour";
import useLastFM from "@src/hooks/lastfm";
import useNavBar from "@src/hooks/navbar";

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
  const controls = useNavBar();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useLastFM();

  useEffect(() => {
    if (!user.userProperties.ready) onClose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userProperties.ready]);

  if (!controls.getters.isVisible) return null;

  return (
    <>
      <Box
        data-testid={testIDs.NavBarRoot}
        bg={componentColour.background}
        borderBottomWidth={"1px"}
        borderBottomStyle={"solid"}
        borderColor={componentColour.border}
        color={componentColour.foreground}
        fontSize={[18, 18, 20]}
        px={[2, 2, 2, 4]}
        style={{ position: "fixed", top: 0, width: "100%" }}
        sx={{
          caretColor: transparent,
        }}
        zIndex={1000}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <NavBarLogo />
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
                aria-label={"Open Menu"}
                data-testid={testIDs.NavBarMobileMenuButton}
                display={{ sm: "none" }}
                disabled={!controls.getters.isHamburgerEnabled}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                ml={[0, 0, 1]}
                onClick={isOpen ? onClose : onOpen}
                size={"md"}
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
