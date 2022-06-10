import { useState, useRef } from "react";
import type { SunBurstReportLayouts } from "../sunburst.report.component";

const useSunBurstLayout = () => {
  const sectionOne = useRef<HTMLDivElement>(null);
  const sectionTwo = useRef<HTMLDivElement>(null);
  const [fitsOnScreen, setFitsOnScreen] = useState(true);
  const [currentLayout, setCurrentLayout] =
    useState<keyof typeof SunBurstReportLayouts>("normal");

  return {
    setters: {
      setCurrentLayout,
      setFitsOnScreen,
    },
    getters: {
      currentLayout,
      fitsOnScreen,
    },
    sections: {
      info: sectionOne,
      chart: sectionTwo,
    },
  };
};

export default useSunBurstLayout;
