import { Box, Flex } from "@chakra-ui/react";
import { testIDs } from "./navbar.mobile.menu.identifiers";
import Condition from "@src/components/condition/condition.component";
import NavBarOptions from "@src/web/navigation/navbar/components/options/navbar.options.component";
import type { ButtonClickHandlerType } from "@src/types/analytics.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { NavBarControllerHookType } from "@src/web/navigation/navbar/state/controllers/navbar.layout.controller.hook";

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
