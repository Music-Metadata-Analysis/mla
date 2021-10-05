import { voidFn } from "../../utils/voids";
import type { NavBarContextInterface } from "../../types/navbar.types";

const InitialValues = <NavBarContextInterface>{
  isVisible: true,
  setIsVisible: voidFn,
};

export default InitialValues;
