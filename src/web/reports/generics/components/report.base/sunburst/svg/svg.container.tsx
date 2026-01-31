import { useRef, useState, useEffect } from "react";
import SunBurstChartSVG from "./svg.class.component";
import type { SunBurstData } from "@src/contracts/api/types/services/generics/aggregates/generic.sunburst.types";
import type { d3Node } from "@src/web/reports/generics/types/state/charts/sunburst.types";

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
