import { createContext, useState } from "react";
import InitialValues from "./navbar.initial";
import type { NavBarProviderInterface } from "@src/types/navbar.types";

export const NavBarContext = createContext(InitialValues);

const NavBarProvider = ({ children }: NavBarProviderInterface) => {
  const [isVisible, setIsVisible] = useState(InitialValues.getters.isVisible);
  const [isHamburgerEnabled, setIsHamburgerEnabled] = useState(
    InitialValues.getters.isHamburgerEnabled
  );

  return (
    <NavBarContext.Provider
      value={{
        getters: {
          isVisible,
          isHamburgerEnabled,
        },
        setters: {
          setIsVisible,
          setIsHamburgerEnabled,
        },
      }}
    >
      {children}
    </NavBarContext.Provider>
  );
};

export default NavBarProvider;
