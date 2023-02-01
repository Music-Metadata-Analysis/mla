import * as d3 from "d3";
import { Component } from "react";
import { classes, ids, testIDs } from "./svg.identifiers";
import RGB from "@src/utilities/colours/rgb.class";
import { valueToZero } from "@src/utilities/generics/numeric";
import { alwaysString, truncate } from "@src/utilities/generics/strings";
import type {
  SunBurstData,
  d3Node,
} from "@src/web/reports/generics/types/charts/sunburst.types";
import type { RefObject } from "react";

export interface SunBurstChartSVGProps {
  containerSize: number;
  colourSet: { foreground: string };
  data: SunBurstData;
  finishTransition: () => void;
  leafEntity: SunBurstData["entity"];
  selectedNode: d3Node;
  setSelectedNode: (node: d3Node) => void;
  size: number;
  svgRef: RefObject<SVGSVGElement>;
}

interface SVGProperties {
  colorSelector: d3.ScaleOrdinal<string, string, never>;
  g: d3.Selection<SVGGElement, d3Node, null, undefined>;
  nodeLabels: d3.Selection<
    d3.BaseType | SVGTextElement,
    d3Node,
    SVGGElement,
    d3Node
  >;
  path: d3.Selection<SVGPathElement, d3Node, SVGGElement, unknown>;
  svg: d3.Selection<SVGSVGElement | null, d3Node, null, undefined>;
  root: d3Node;
  radius: number;
  parent: d3.Selection<SVGCircleElement, d3Node, null, undefined>;
}

export default class SunBurstChartSVG extends Component<SunBurstChartSVGProps> {
  graphic: SVGProperties;
  padding = 10;
  percentageFontSize = 30;
  maxLabelLength = 60;
  nodeLabelFont = "9px Helvetica";

  constructor(props: SunBurstChartSVGProps) {
    super(props);

    this.graphic = {
      root: this.createRootNode(),
    } as SVGProperties;
  }

  componentDidUpdate(prevProps: SunBurstChartSVGProps) {
    if (
      prevProps.containerSize !== this.props.containerSize ||
      prevProps.size !== this.props.size
    ) {
      this.updateViewBox();
    }
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.updateSVG();
    }
    if (
      JSON.stringify(prevProps.selectedNode.data) !==
      JSON.stringify(this.props.selectedNode.data)
    ) {
      this.updateSelection(this.props.selectedNode);
    }
    if (prevProps.colourSet !== this.props.colourSet) {
      this.updateColours(this.props.colourSet);
    }
  }

  componentDidMount() {
    this.updateSVG();
  }

  private updateViewBox = () => {
    this.graphic.svg.attr("viewBox", this.getViewBox(this.padding - 1));
    setTimeout(
      () => this.graphic.svg.attr("viewBox", this.getViewBox(this.padding)),
      1
    );
  };

  private updateColours = (colourSet: SunBurstChartSVGProps["colourSet"]) => {
    this.graphic.g
      .select<SVGTextElement>(`#${classes.SunburstPercentageDisplay}`)
      .style("fill", colourSet.foreground);
    this.graphic.nodeLabels.style("fill", colourSet.foreground);
  };

  private updateSelection = (p: d3Node) => {
    this.graphic.parent.datum(p.parent || this.graphic.root);
    this.setMainTitle(p);
    this.setAllNodeTargets(p);
    this.triggerPathTransition();
    this.setNodeLabels();
    if (p !== this.graphic.root) {
      this.graphic.g
        .select<SVGTextElement>(`#${classes.SunburstPercentageDisplay}`)
        .style("cursor", "pointer")
        .on("click", () => this.props.setSelectedNode(p.parent as d3Node));
    } else {
      this.graphic.g
        .select<SVGTextElement>(`#${classes.SunburstPercentageDisplay}`)
        .style("cursor", null)
        .on("click", null);
    }
  };

  private updateSVG() {
    this.createColourSelector();
    this.graphic.root = this.createRootNode();
    this.props.setSelectedNode(this.graphic.root);
    this.graphic.radius = this.props.size / 6;
    this.clearAllNodes();
    this.graphic.svg = this.getSVGElement();
    this.graphic.g = this.createTransformGroup();
    this.graphic.path = this.createPath();
    this.createPathClickInterface();
    this.createPathTitles();
    this.graphic.nodeLabels = this.createNodeLabels();
    this.graphic.parent = this.createTitleGroup();
    this.createMainTitleLabel();
    this.setMainTitle(this.graphic.root);
  }

  render() {
    return (
      <svg
        width={this.props.containerSize}
        ref={this.props.svgRef}
        data-testid={testIDs.SunBurstChartSVG}
        xmlns="http://www.w3.org/2000/svg"
      />
    );
  }

  private getViewBox = (padding: number) => {
    return [
      -padding / 2,
      -padding / 2,
      this.props.size + padding,
      this.props.size + padding,
    ];
  };

  private createRootNode = () => {
    const root = this.partition(this.props.data) as d3Node;
    root.each((d) => {
      d.current = d;
    });
    return root;
  };

  private createColourSelector = () => {
    this.graphic.colorSelector = d3.scaleOrdinal(
      d3.quantize(
        d3.interpolateRainbow,
        valueToZero(this.props.data.children?.length) + 1
      )
    );
  };

  private createRGBA = (node: d3Node, hierarchy: d3Node, visible: boolean) => {
    const colour = new RGB(this.graphic.colorSelector(hierarchy.data.name));
    const opacity = visible ? (node.children ? 0.6 : 0.4) : 0;
    return colour.addAlpha(opacity);
  };

  private assignColor = (d: d3Node, visible: boolean) => {
    let tree = d;
    while (tree.depth > 1) {
      tree.colour = this.createRGBA(tree, tree.parent as d3Node, visible);
      tree = tree.parent as d3Node;
    }
    if (d.colour && visible) {
      d.colour = this.createRGBA(d, tree, visible);
      return d.colour.getRGBA();
    }
    tree.colour = this.createRGBA(tree, tree, visible);
    return tree.colour.getRGBA();
  };

  private partition = (data: SunBurstData) => {
    const root = d3
      .hierarchy(data)
      .sum((d) => valueToZero(d.value))
      .sort((a, b) => valueToZero(b.value) - valueToZero(a.value));

    const partition = d3
      .partition<SunBurstData>()
      .size([2 * Math.PI, root.height + 1])(root);

    return partition;
  };

  private clearAllNodes = () => {
    this.props.svgRef.current?.querySelectorAll("g").forEach((node) => {
      node.remove();
    });
  };

  private getSVGElement = () => {
    return d3
      .select<SVGSVGElement | null, d3Node>(this.props.svgRef.current)
      .attr("viewBox", this.getViewBox(this.padding))
      .style("font", this.nodeLabelFont);
  };

  private createTransformGroup = () => {
    return this.graphic.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.props.size / 2},${this.props.size / 2})`
      );
  };

  private createPath = () => {
    const path = this.graphic.g
      .append("g")
      .selectAll<SVGPathElement, null>("path")
      .data(this.graphic.root.descendants().slice(1))
      .join("path")
      .attr("fill", (d: d3Node) => {
        return this.assignColor(d, this.isArcVisible(d));
      })
      .attr("d", (d) => {
        return d3
          .arc<d3.HierarchyRectangularNode<SunBurstData>>()
          .startAngle((d) => {
            return d.x0;
          })
          .endAngle((d) => d.x1)
          .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
          .padRadius(this.graphic.radius * 1.5)
          .innerRadius((d) => d.y0 * this.graphic.radius)
          .outerRadius((d) =>
            Math.max(d.y0 * this.graphic.radius, d.y1 * this.graphic.radius - 1)
          )(d.current);
      });

    return path;
  };

  private createPathClickInterface = () => {
    this.graphic.path
      .filter((d) => this.isArcVisible(d))
      .attr("class", classes.SunBurstClickableNode)
      .style("cursor", "pointer")
      .on("click", this.clickInterface);
  };

  private createPathTitles = () => {
    this.graphic.path.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .filter((d) => !this.isLeafNode(d))
          .map((d) => d.data.name)
          .reverse()
          .join("/")}\n${d3.format(",d")(valueToZero(d.value))}`
    );
  };

  private createTitleGroup = () => {
    return this.graphic.g
      .append("circle")
      .datum(this.graphic.root)
      .attr("r", this.graphic.radius)
      .attr("fill", "none")
      .attr("pointer-events", "all");
  };

  private clickInterface = (
    event: React.MouseEvent<SVGSVGElement>,
    p: d3Node
  ) => {
    this.props.setSelectedNode(p);
  };

  private setMainTitle = (d: d3Node) => {
    this.graphic.g
      .select<SVGTextElement>(`#${classes.SunburstPercentageDisplay}`)
      .attr("class", classes.SunburstPercentageDisplay)
      .style("fill", this.props.colourSet.foreground)
      .text(`${this.getPercentage(d.value)}%`);
  };

  private getPercentage(value: number | undefined) {
    const percentage =
      (100 * valueToZero(value)) / valueToZero(this.graphic.root.value);
    if (percentage === 100) return percentage;
    return percentage.toFixed(2);
  }

  private setAllNodeTargets = (p: d3Node) => {
    this.graphic.root.each((d) => {
      if (!this.isLeafNode(d)) {
        d.target = {
          ...d.target,
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        };
      }
    });
  };

  private triggerPathTransition = () => {
    let nodeCount = 0;
    let updated = 0;

    this.graphic.path
      .transition(this.createTransition())
      .tween("data", (d) => {
        const i = d3.interpolate(d.current, d.target);
        return (t) => (d.current = i(t));
      })
      .filter((d) => {
        return !this.isLeafNode(d) && this.isArcVisible(d);
      })
      .attr("fill", (d: d3Node) =>
        this.assignColor(d, this.isArcVisible(d.target))
      )
      .each(() => (nodeCount += 1))
      .attrTween("d", (d) => () => {
        const transition = d3
          .arc<d3.HierarchyRectangularNode<SunBurstData>>()
          .startAngle((d) => d.x0)
          .endAngle((d) => d.x1)
          .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
          .padRadius(this.graphic.radius * 1.5)
          .innerRadius((d) => d.y0 * this.graphic.radius)
          .outerRadius((d) =>
            Math.max(d.y0 * this.graphic.radius, d.y1 * this.graphic.radius - 1)
          )(d.current);
        return alwaysString(transition);
      })
      .each(() => {
        updated += 1;
        if (updated == nodeCount) this.props.finishTransition();
      });
  };

  private setNodeLabels = () => {
    const needsModification = (opacity: number, node: d3Node) => {
      return opacity > 0 || this.isLabelVisible(node);
    };

    function filter(this: d3.BaseType | SVGTextElement, d: d3Node) {
      const attr = alwaysString(
        (this as SVGElement).getAttribute("fill-opacity")
      );
      return needsModification(parseFloat(attr), d.target);
    }

    this.graphic.nodeLabels
      .filter((d) => !this.isLeafNode(d))
      .filter(filter)
      .transition(this.createTransition())
      .attr("fill-opacity", (d) => +this.isLabelVisible(d.target))
      .attrTween(
        "transform",
        (d) => () => this.triggerLabelTransform(d.current)
      );
  };

  private createMainTitleLabel = () => {
    this.graphic.g
      .append("text")
      .datum(this.graphic.root)
      .attr("id", ids.SunburstPercentageDisplay)
      .attr("font-size", this.percentageFontSize)
      .attr("x", 0)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle");
  };

  private createNodeLabels = () => {
    const updatedLabels = this.graphic.g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll<d3.BaseType, SVGTextElement>("text")
      .data(this.graphic.root.descendants().slice(1))
      .join("text")
      .filter((d) => !this.isLeafNode(d))
      .attr("class", classes.SunBurstNodeLabel)
      .attr("dy", "0.35em")
      .style("fill", this.props.colourSet.foreground)
      .attr("fill-opacity", (d) => +this.isLabelVisible(d.current))
      .attr("transform", (d) => this.triggerLabelTransform(d.current))
      .text((d) => d.data.name);

    this.truncateNodeLabels();

    return updatedLabels;
  };

  private truncateNodeLabels = () => {
    this.graphic.g
      .selectAll<SVGTextElement, SVGTextElement>("text")
      .nodes()
      .forEach((el) => {
        if (el && el.getAttribute("class") == classes.SunBurstNodeLabel) {
          const width = el.getComputedTextLength();
          const charWidth = width / el.innerHTML.length;
          const maximumCharacters = Math.floor(this.maxLabelLength / charWidth);
          el.innerHTML = truncate(el.innerHTML, maximumCharacters);
        }
      });
  };

  private createTransition = () => {
    return this.graphic.g
      .transition()
      .duration(750) as unknown as d3.Transition<
      d3.BaseType,
      unknown,
      null,
      undefined
    >; // transition() argument accepts only d3.BaseType
  };

  private isArcVisible = (d: d3Node) => {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  };

  isLabelVisible = (d: d3Node) => {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.06;
  };

  private isLeafNode = (d: d3Node) => {
    return d.data.entity === this.props.leafEntity;
  };

  private triggerLabelTransform = (d: d3Node) => {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = ((d.y0 + d.y1) / 2) * this.graphic.radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  };
}
