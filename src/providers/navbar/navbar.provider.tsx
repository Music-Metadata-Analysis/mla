import { createContext } from "react";
import InitialValues from "./navbar.initial";
import useToggle from "@src/hooks/utility/toggle";
import type { NavBarProviderInterface } from "@src/types/navbar.types";

export const NavBarContext = createContext(InitialValues);

const NavBarProvider = ({ children }: NavBarProviderInterface) => {
  const hamburger = useToggle(InitialValues.hamburger.state);
  const mobileMenu = useToggle(InitialValues.mobileMenu.state);
  const navigation = useToggle(InitialValues.navigation.state);

  return (
    <NavBarContext.Provider
      value={{
        hamburger,
        mobileMenu: mobileMenu,
        navigation,
      }}
    >
      {children}
    </NavBarContext.Provider>
  );
};

export default NavBarProvider;
