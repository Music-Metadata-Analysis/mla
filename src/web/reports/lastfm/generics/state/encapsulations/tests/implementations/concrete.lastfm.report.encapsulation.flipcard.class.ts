import LastFMReportFlipCardBaseStateEncapsulation from "../../lastfm.report.encapsulation.flipcard.base.class";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";

export default class ConcreteBaseReportState extends LastFMReportFlipCardBaseStateEncapsulation {
  getDataSource = () => this.reportProperties.data.report.albums as unknown[];

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
    new analyticsVendor.collection.EventDefinition({
      category: "LAST.FM",
      label: "TEST",
      action: "TEST",
    });
}
