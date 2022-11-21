import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import NavBarColorModeContainer from "../navbar.colour.mode/navbar.colour.mode.container";
import NavBarLogo from "../navbar.logo/navbar.logo.component";
import NavBarMobileMenu from "../navbar.mobile.menu/navbar.mobile.menu.component";
import NavBarOptions from "../navbar.options/navbar.options.component";
import NavBarSessionControlContainer from "../navbar.session.control/navbar.session.control.container";
import NavBarSpinner from "../navbar.spinner/navbar.spinner.component";
import useColour from "@src/hooks/colour";
import type { NavBarControllerHookType } from "../navbar.controllers/navbar.ui.controller";
import type { ButtonClickHandlerType } from "@src/types/analytics.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export const testIDs = {
  NavBarRoot: "NavBarRoot",
  NavBarMenu: "NavBarMenu",
  NavBarMobileMenuButton: "NavBarMobileMenuButton",
};

interface NavBarRootProps {
  analytics: { trackButtonClick: ButtonClickHandlerType };
  config: { [index: string]: string };
  controls: NavBarControllerHookType["controls"];
  navBarT: tFunctionType;
  transaction: boolean;
  rootReference: NavBarControllerHookType["rootReference"];
  router: { path: string };
  user: { name?: string; image?: string };
}

export default function NavBarRoot({
  analytics,
  config,
  controls,
  navBarT,
  transaction,
  rootReference,
  router,
  user,
}: NavBarRootProps) {
  const { componentColour, transparent } = useColour();

  const NavBarOptionsComponent = () => (
    <NavBarOptions
      closeMobileMenu={controls.mobileMenu.setFalse}
      config={config}
      currentPath={router.path}
      navBarT={navBarT}
      transaction={transaction}
      tracker={analytics.trackButtonClick}
    />
  );

  return (
    <Box
      ref={rootReference}
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
        <NavBarLogo
          closeMobileMenu={controls.mobileMenu.setFalse}
          currentPath={router.path}
          navBarT={navBarT}
          transaction={transaction}
          tracker={analytics.trackButtonClick}
          user={user}
        />
        <NavBarSpinner whileTrue={transaction}>
          <Flex
            data-testid={testIDs.NavBarMenu}
            h={16}
            alignItems={"center"}
            justifyContent={"flex-end"}
          >
            <NavBarColorModeContainer tracker={analytics.trackButtonClick} />
            <NavBarSessionControlContainer
              closeMobileMenu={controls.mobileMenu.setFalse}
            />
            <IconButton
              aria-label={"Open Menu"}
              data-testid={testIDs.NavBarMobileMenuButton}
              display={{ sm: "none" }}
              disabled={!controls.hamburger.state}
              icon={
                controls.mobileMenu.state ? <CloseIcon /> : <HamburgerIcon />
              }
              ml={[0, 0, 1]}
              onClick={controls.mobileMenu.toggle}
              size={"md"}
            />
            <Flex alignItems={"center"}>
              <Flex as={"nav"} display={{ base: "none", sm: "flex" }}>
                <NavBarOptionsComponent />
              </Flex>
            </Flex>
          </Flex>
        </NavBarSpinner>
      </Flex>
      <NavBarMobileMenu
        analytics={{ trackButtonClick: analytics.trackButtonClick }}
        config={config}
        controls={controls}
        navBarT={navBarT}
        transaction={transaction}
        router={router}
      />
    </Box>
  );
}