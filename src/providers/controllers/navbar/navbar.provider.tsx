import { createContext } from "react";
import InitialValues from "./navbar.initial";
import useToggle from "@src/utilities/react/hooks/toggle.hook";
import type { NavBarControllerProviderInterface } from "@src/types/controllers/navbar/navbar.types";

export const NavBarControllerContext = createContext(InitialValues);

const NavBarControllerProvider = ({
  children,
}: NavBarControllerProviderInterface) => {
  const hamburger = useToggle(InitialValues.hamburger.state);
  const mobileMenu = useToggle(InitialValues.mobileMenu.state);
  const navigation = useToggle(InitialValues.navigation.state);

  return (
    <NavBarControllerContext.Provider
      value={{
        hamburger,
        mobileMenu: mobileMenu,
        navigation,
      }}
    >
      {children}
    </NavBarControllerContext.Provider>
  );
};

export default NavBarControllerProvider;
