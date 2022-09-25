import { voidFn } from "@src/utils/voids";
import type { NavBarContextInterface } from "@src/types/navbar.types";

const InitialValues = <NavBarContextInterface>{
  getters: {
    isVisible: true,
    isHamburgerEnabled: true,
  },
  setters: {
    setIsVisible: voidFn,
    setIsHamburgerEnabled: voidFn,
  },
};

export default InitialValues;
