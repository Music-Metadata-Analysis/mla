import { Box, Flex } from "@chakra-ui/react";
import NavBarOptions from "../navbar.options/navbar.options.component";
import Condition from "@src/components/condition/condition.component";
import type { NavBarControllerHookType } from "../navbar.controllers/navbar.ui.controller";
import type { ButtonClickHandlerType } from "@src/types/analytics.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export const testIDs = {
  NavBarMobileMenu: "NavBarMobileMenu",
};

interface NavBarMobileMenuProps {
  analytics: { trackButtonClick: ButtonClickHandlerType };
  config: { [index: string]: string };
  controls: NavBarControllerHookType["controls"];
  navBarT: tFunctionType;
  transaction: boolean;
  router: { path: string };
}

export default function NavBarMobileMenu({
  analytics,
  config,
  controls,
  navBarT,
  transaction,
  router,
}: NavBarMobileMenuProps) {
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
    <Condition isTrue={controls.mobileMenu.state}>
      <Box
        data-testid={testIDs.NavBarMobileMenu}
        pb={4}
        display={{ sm: "none" }}
      >
        <Flex flexDirection={"column"}>
          <NavBarOptionsComponent />
        </Flex>
      </Box>
    </Condition>
  );
}