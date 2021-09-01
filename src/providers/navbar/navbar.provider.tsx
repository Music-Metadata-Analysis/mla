import { createContext, useState } from "react";
import InitialValues from "./navbar.initial";
import type { NavBarProviderInterface } from "../../types/navbar.types";

export const NavBarContext = createContext(InitialValues);

const NavBarProvider = ({ children }: NavBarProviderInterface) => {
  const [isVisible, setIsVisible] = useState(InitialValues.isVisible);

  return (
    <NavBarContext.Provider
      value={{
        isVisible,
        setIsVisible,
      }}
    >
      {children}
    </NavBarContext.Provider>
  );
};

export default NavBarProvider;
