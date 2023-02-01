import { useEffect, useState, useRef } from "react";
import {
  calculateCanFitOnScreen,
  calculateLayoutType,
} from "./sunburst.report.layout.controller.utility";

export type SunburstReportLayoutType = {
  flexDirection: "row" | "column";
  alignItems: "center" | "flex-start";
};

export const SunBurstLayoutFlexProps: {
  [key: string]: SunburstReportLayoutType;
} = {
  compact: {
    flexDirection: "column",
    alignItems: "center",
  },
  normal: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
};

const useSunBurstLayoutController = () => {
  const refInfo = useRef<HTMLDivElement>(null);
  const refChart = useRef<HTMLDivElement>(null);
  const [canFitOnScreen, setCanFitOnScreen] = useState(true);
  const [currentLayout, setCurrentLayout] =
    useState<keyof typeof SunBurstLayoutFlexProps>("normal");

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => {
      window.removeEventListener("resize", updateLayout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLayout = () => {
    setCanFitOnScreen(calculateCanFitOnScreen());
    setCurrentLayout(calculateLayoutType(refInfo, refChart));
  };

  return {
    canFitOnScreen,
    flexProps: SunBurstLayoutFlexProps[currentLayout],
    ref: {
      info: refInfo,
      chart: refChart,
    },
    update: updateLayout,
  };
};

export default useSunBurstLayoutController;

export type SunBurstLayoutControllerHookType = ReturnType<
  typeof useSunBurstLayoutController
>;
