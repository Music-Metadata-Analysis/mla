import Events from "@src/events/events";
import { singular } from "@src/utils/strings";
import type EventDefinition from "@src/contracts/events/event.class";
import type { SunBurstEntityTypes } from "@src/types/analytics.types";
import type {
  d3Node,
  SunBurstData,
} from "@src/types/reports/generics/sunburst.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

type SunBurstNodeAbstractBaseConstructor = new (
  node: d3Node
) => SunBurstNodeAbstractBase;

abstract class SunBurstNodeAbstractBase {
  protected node: d3Node;
  protected abstract leafEntity: SunBurstData["entity"];

  constructor(node: d3Node) {
    this.node = node;
  }

  protected getOriginalChildren = (): Array<d3Node> => {
    if (this.node.children) return this.node.children;
    return [];
  };

  abstract getDrawerTitle(): string;
  abstract getDrawerSubTitle(t: tFunctionType): string | null;
  abstract getDrawerListTitle(t: tFunctionType): string | null;

  abstract getDrawerPercentage(): string;
  abstract getDrawerEntityListPercentage(): string;

  getChildren = (): Array<SunBurstNodeAbstractBase> => {
    return this.getOriginalChildren().map(
      (child) =>
        new (this.constructor as SunBurstNodeAbstractBaseConstructor)(child)
    );
  };

  getChildEntity = (): SunBurstData["entity"] => {
    if (Array.isArray(this.node.children) && this.node.children.length > 0) {
      return this.node.children[0].data.entity;
    }
    return "unknown";
  };

  getDrawerEvent(): EventDefinition {
    const entity = singular(
      this.getNodeEntity()
    ).toUpperCase() as SunBurstEntityTypes;
    const name = this.getNodeName();
    return Events.LastFM.SunBurstNodeSelected(entity, name);
  }

  hasLeafChildren = (): boolean => {
    return this.getChildEntity() === this.leafEntity;
  };

  getLeafEntityType = (): SunBurstData["entity"] => {
    return this.leafEntity;
  };

  getNode = (): d3Node => {
    return this.node;
  };

  getNodeColour = (): string => {
    return this.node.colour.getRGBA();
  };

  getNodeEntity = (): SunBurstData["entity"] => {
    return this.node.data.entity;
  };

  getNodeName = (): string => {
    return this.node.data.name;
  };

  getParent = (): d3Node | null => {
    if (this.node.parent) return this.node.parent;
    return null;
  };

  getParentName = (): string | null => {
    if (this.node.parent && this.node.parent.data.name)
      return this.node.parent.data.name;
    return null;
  };

  getSunBurstTotal = () => {
    const total = this.findRoot(this.node).value as number;
    return total;
  };

  getValuePercentage = () => {
    const percentage = (this.getValue() / this.getSunBurstTotal()) * 100;
    return percentage;
  };

  getValue = (): number => {
    if (this.node.value) return this.node.value;
    return 0;
  };

  protected findParent = (node: d3Node) => node.parent;

  protected findRoot = (node: d3Node): d3Node => {
    const parent = this.findParent(node) as d3Node;
    if (!parent) return node;
    return this.findRoot(parent);
  };
}

export default SunBurstNodeAbstractBase;
