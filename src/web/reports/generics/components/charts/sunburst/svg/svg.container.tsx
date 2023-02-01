import { useRef, useState, useEffect } from "react";
import SunBurstChartSVG from "./svg.class.component";
import type {
  SunBurstData,
  d3Node,
} from "@src/web/reports/generics/types/charts/sunburst.types";

export interface SunBurstChartContainerSVGProps {
  colourSet: { foreground: string };
  data: SunBurstData;
  finishTransition: () => void;
  leafEntity: SunBurstData["entity"];
  selectedNode: d3Node;
  setSelectedNode: (node: d3Node) => void;
  size: number;
}

export default function SunBurstChartSVGContainer(
  props: SunBurstChartContainerSVGProps
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [windowSize, setWindowSize] = useState(window.innerHeight);

  useEffect(() => {
    const windowResize = () => {
      setWindowSize(window.innerHeight);
    };
    window.addEventListener("resize", windowResize);
    return () => window.removeEventListener("resize", windowResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SunBurstChartSVG
      containerSize={windowSize}
      colourSet={props.colourSet}
      data={props.data}
      finishTransition={props.finishTransition}
      leafEntity={props.leafEntity}
      selectedNode={props.selectedNode}
      setSelectedNode={props.setSelectedNode}
      size={props.size}
      svgRef={svgRef}
    />
  );
}
