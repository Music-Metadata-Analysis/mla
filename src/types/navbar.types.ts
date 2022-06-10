import type { Dispatch, SetStateAction } from "react";

export interface NavBarContextInterface {
  getters: {
    isVisible: boolean;
    isHamburgerEnabled: boolean;
  };
  setters: {
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    setIsHamburgerEnabled: Dispatch<SetStateAction<boolean>>;
  };
}

export interface NavBarProviderInterface {
  children: React.ReactNode;
}
