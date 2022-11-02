import settings from "@src/config/sunburst";
import type { RefObject } from "react";

const getRefProperty = (
  ref: RefObject<HTMLDivElement>,
  property: "clientWidth" | "clientHeight"
): number => {
  if (!ref.current) return 0;
  return ref.current[property];
};

const getRefSum = (
  refArray: Array<RefObject<HTMLDivElement>>,
  property: "clientWidth" | "clientHeight"
) => {
  return refArray.reduce((sum, ref) => sum + getRefProperty(ref, property), 0);
};

export const calculateCanFitOnScreen = () => {
  if (
    window.innerHeight < settings.minimumCompactHeight ||
    window.innerWidth < settings.minimumCompactWidth
  )
    return false;

  if (
    window.innerHeight < settings.minimumHeight &&
    window.innerWidth < settings.minimumWidth
  )
    return false;

  return true;
};

export const calculateLayoutType = (
  div1: RefObject<HTMLDivElement>,
  div2: RefObject<HTMLDivElement>
) => {
  if (
    window.innerHeight - settings.navbarOffset >=
    getRefSum([div1, div2], "clientHeight")
  ) {
    if (getRefSum([div1, div2], "clientWidth") < window.innerWidth) {
      return "compact";
    }
  }
  return "normal";
};
