import { voidFn } from "@src/utilities/generics/voids";
import type { NavBarControllerContextInterface } from "@src/types/controllers/navbar/navbar.types";

const InitialValues = <NavBarControllerContextInterface>{
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
