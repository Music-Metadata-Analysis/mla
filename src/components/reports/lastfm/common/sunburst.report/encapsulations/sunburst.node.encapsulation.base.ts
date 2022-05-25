import Events from "../../../../../../events/events";
import { singular } from "../../../../../../utils/strings";
import type EventDefinition from "../../../../../../events/event.class";
import type { SunBurstEntityTypes } from "../../../../../../types/analytics.types";
import type {
  d3Node,
  SunBurstData,
} from "../../../../../../types/reports/sunburst.types";
import type { TFunction } from "next-i18next";

type SunBurstNodeEncapsulationConstructor = new (
  node: d3Node
) => SunBurstNodeEncapsulation;

abstract class SunBurstNodeEncapsulation {
  private node: d3Node;
  abstract leafEntity: SunBurstData["entity"];

  constructor(node: d3Node) {
    this.node = node;
  }

  private getOriginalChildren = (): Array<d3Node> => {
    if (this.node.children) return this.node.children;
    return [];
  };

  abstract getDrawerTitle(): string;
  abstract getDrawerSubTitle(t: TFunction): string | null;
  abstract getDrawerListTitle(t: TFunction): string | null;

  abstract getDrawerPercentage(): string;
  abstract getDrawerEntityListPercentage(): string;

  getChildren = (): Array<SunBurstNodeEncapsulation> => {
    return this.getOriginalChildren().map(
      (child) =>
        new (this.constructor as SunBurstNodeEncapsulationConstructor)(child)
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

  private findParent = (node: d3Node) => node.parent;

  private findRoot = (node: d3Node): d3Node => {
    const parent = this.findParent(node) as d3Node;
    if (!parent) return node;
    return this.findRoot(parent);
  };
}

export default SunBurstNodeEncapsulation;
