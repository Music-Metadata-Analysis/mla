import { voidFn } from "../../utils/voids";
import type { NavBarContextInterface } from "../../types/navbar.types";

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
