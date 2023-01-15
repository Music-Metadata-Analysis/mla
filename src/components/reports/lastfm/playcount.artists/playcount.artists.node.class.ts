import SunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import { capitalize } from "@src/utilities/generics/strings";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

export default class PlayCountByArtistNodeEncapsulation extends SunBurstNodeAbstractBase {
  leafEntity = "tracks" as const;

  getDrawerEntityListPercentage(): string {
    if (this.getNodeEntity() === "root") return "100";
    const rounded = Number(this.getValuePercentage().toFixed(0));
    const precision = (this.getValue() / this.getSunBurstTotal()) * 100;
    return this.withModifier(rounded, precision);
  }

  protected withModifier(rounded: number, precision: number) {
    if (rounded === 0) return ">1";
    if (rounded <= 1 && rounded > precision) return ">1";
    return String(rounded);
  }

  getDrawerListTitle(t: tFunctionType): string | null {
    const childEntity = this.getChildEntity();
    if (childEntity === "unknown" && !this.hasLeafChildren()) {
      return null;
    }
    return capitalize(t(`entities.${childEntity}`) + ":");
  }

  getDrawerPercentage(): string {
    if (this.getNodeEntity() === "root") return "100";
    return this.getValuePercentage().toFixed(2);
  }

  getDrawerSubTitle(): string | null {
    const parentName = this.getParentName();
    if (!parentName) return null;
    return parentName;
  }

  getDrawerTitle(): string {
    return this.getNode().data.name;
  }
}
