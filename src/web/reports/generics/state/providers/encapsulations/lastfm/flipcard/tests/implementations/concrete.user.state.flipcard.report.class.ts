import UserFlipCardBaseReportState from "../../user.state.base.flipcard.report.class";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";

export default class ConcreteBaseReportState extends UserFlipCardBaseReportState {
  getDataSource = () => this.userProperties.data.report.albums as unknown[];

  getDefaultEntityName = () => {
    return this.defaultAlbumName;
  };

  getDrawerTitle = (index: number) => {
    return `Mock Title: ${this.getName(index)}`;
  };

  getExternalLink = (index: number) => {
    return `Mock Url: ${this.getName(index)}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDrawerEvent = (index: number) =>
    new analyticsVendor.EventDefinition({
      category: "LAST.FM",
      label: "TEST",
      action: "TEST",
    });
}
