import type { Dispatch, SetStateAction } from "react";

export interface NavBarContextInterface {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export interface NavBarProviderInterface {
  children: React.ReactNode;
}
