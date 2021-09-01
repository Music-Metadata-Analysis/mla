import { voidSetter } from "../../utils/voids";
import type { NavBarContextInterface } from "../../types/navbar.types";

const InitialValues = <NavBarContextInterface>{
  isVisible: true,
  setIsVisible: voidSetter,
};

export default InitialValues;
