import { useRef, useState, useEffect } from "react";
import SunBurstChart from "./chart.component";
import useColour from "../../../../hooks/colour";
import type {
  SunBurstData,
  d3Node,
} from "../../../../types/reports/sunburst.types";

export interface SunBurstChartContainerProps {
  data: SunBurstData;
  size: number;
  finishTransition: () => void;
  leafEntity: SunBurstData["entity"];
  selectedNode: d3Node;
  setSelectedNode: (node: d3Node) => void;
}

const SunBurstChartContainer = (props: SunBurstChartContainerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [windowSize, setWindowSize] = useState(window.innerHeight);
  const {
    sunBurstColour,
    utilities: { colourToCSS },
  } = useColour();

  useEffect(() => {
    const windowResize = () => {
      setWindowSize(window.innerHeight);
    };
    window.addEventListener("resize", windowResize);
    return () => window.removeEventListener("resize", windowResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SunBurstChart
      containerSize={windowSize}
      colourSet={{ foreground: colourToCSS(sunBurstColour.foreground) }}
      data={props.data}
      finishTransition={props.finishTransition}
      leafEntity={props.leafEntity}
      selectedNode={props.selectedNode}
      setSelectedNode={props.setSelectedNode}
      size={props.size}
      svgRef={svgRef}
    />
  );
};

export default SunBurstChartContainer;
