import UserFlipCardBaseReportState from "../../user.state.base.flipcard.report.class";
import EventDefinition from "@src/contracts/events/event.class";

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
    new EventDefinition({
      category: "LAST.FM",
      label: "TEST",
      action: "TEST",
    });
}
