import SunBurstNodeEncapsulation from "../../sunburst.node.encapsulation.base";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export default class MockSunBurstNodeEncapsulation extends SunBurstNodeEncapsulation {
  leafEntity = "tracks" as const;

  getDrawerTitle(): string {
    return "MockDrawerTitle";
  }
  getDrawerSubTitle(t: tFunctionType): string | null {
    if (this.getNode().data.entity === "root") return null;
    return t("MockDrawerSubTitle");
  }
  getDrawerListTitle(): string | null {
    if (this.getNode().children) return "MockDrawerListTitle";
    return null;
  }
  getDrawerPercentage(): string {
    return "MockDrawerPercentage";
  }
  getDrawerEntityListPercentage(): string {
    return "MockEntityListPercentage";
  }
}