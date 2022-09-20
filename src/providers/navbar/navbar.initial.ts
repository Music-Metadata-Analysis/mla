import { voidFn } from "@src/utils/voids";
import type { NavBarContextInterface } from "@src/types/navbar.types";

const InitialValues = <NavBarContextInterface>{
  hamburger: {
    state: true,
    setFalse: voidFn,
    setTrue: voidFn,
    toggle: voidFn,
  },
  mobileMenu: {
    state: false,
    setFalse: voidFn,
    setTrue: voidFn,
    toggle: voidFn,
  },
  navigation: {
    state: true,
    setFalse: voidFn,
    setTrue: voidFn,
    toggle: voidFn,
  },
};

export default InitialValues;
