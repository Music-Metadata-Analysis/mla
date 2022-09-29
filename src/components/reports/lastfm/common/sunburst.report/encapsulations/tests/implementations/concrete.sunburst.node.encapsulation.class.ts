import SunBurstNodeEncapsulation from "../../sunburst.node.encapsulation.base";

export default class MockSunBurstNodeEncapsulation extends SunBurstNodeEncapsulation {
  leafEntity = "tracks" as const;

  getDrawerTitle(): string {
    return "MockDrawerTitle";
  }
  getDrawerSubTitle(): string | null {
    if (this.getNode().data.entity === "root") return null;
    return "MockDrawerSubTitle";
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
