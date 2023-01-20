import { voidFn } from "@src/utilities/generics/voids";
import type { NavBarControllerContextInterface } from "@src/web/navigation/navbar/types/state/provider.types";

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
