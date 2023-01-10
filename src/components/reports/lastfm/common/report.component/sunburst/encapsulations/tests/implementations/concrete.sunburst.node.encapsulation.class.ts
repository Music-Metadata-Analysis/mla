import SunBurstNodeAbstractBase from "../../sunburst.node.encapsulation.base.class";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

export default class MockSunBurstNodeAbstractBase extends SunBurstNodeAbstractBase {
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
