import LastFMReportFlipCardBaseStateEncapsulation from "../../../generics/state/encapsulations/lastfm.report.encapsulation.flipcard.base.class";
import Events from "@src/web/analytics/collection/events/definitions";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { LastFMReportStateArtistReport } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

export default class LastFMReportFlipCardTopArtistsStateEncapsulation extends LastFMReportFlipCardBaseStateEncapsulation {
  reportProperties: LastFMReportStateArtistReport;

  constructor(
    reportProperties: LastFMReportStateArtistReport,
    t: tFunctionType
  ) {
    super(reportProperties, t);
    this.reportProperties = reportProperties;
  }

  getDataSource = () => this.reportProperties.data.report.artists;

  getDefaultEntityName = () => {
    return this.defaultArtistName;
  };

  getDrawerTitle = (index: number) => {
    return `${this.getName(index)}`;
  };

  getDrawerEvent = (index: number) => {
    return Events.LastFM.ArtistViewed(this.getName(index));
  };

  getExternalLink = (index: number) => {
    const apiObject = this.getDataSource()[index] as { url?: string };
    const encodedArtistName = encodeURIComponent(this.getName(index));
    return this.withDefault(
      apiObject?.url,
      `${this.lastfmPrefix}/${encodedArtistName}`
    );
  };
}
