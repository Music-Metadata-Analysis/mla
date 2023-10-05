import LastFMReportFlipCardBaseStateEncapsulation from "../../../generics/state/encapsulations/lastfm.report.encapsulation.flipcard.base.class";
import Events from "@src/web/analytics/collection/events/definitions";
import type { LastFMUserArtistInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.artists.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { LastFMReportStateTrackReport } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

export default class LastFMReportFlipCardTopTracksStateEncapsulation extends LastFMReportFlipCardBaseStateEncapsulation {
  reportProperties: LastFMReportStateTrackReport;

  constructor(
    reportProperties: LastFMReportStateTrackReport,
    t: tFunctionType
  ) {
    super(reportProperties, t);
    this.reportProperties = reportProperties;
  }

  getDataSource = () => this.reportProperties.data.report.tracks;

  getDefaultEntityName = () => {
    return this.defaultTrackName;
  };

  getDrawerTitle = (index: number) => {
    return `${this.getRelatedArtistName(index)}: ${this.getName(index)}`;
  };

  getDrawerEvent = (index: number) => {
    return Events.LastFM.TrackViewed(
      this.getRelatedArtistName(index),
      this.getName(index)
    );
  };

  getExternalLink = (index: number) => {
    const apiObject = this.getDataSource()[index] as { url?: string };
    const encodedTrackName = encodeURIComponent(this.getName(index));
    const encodedArtistName = encodeURIComponent(
      this.getRelatedArtistName(index)
    );
    return this.withDefault(
      apiObject?.url,
      `${this.lastfmPrefix}/${encodedArtistName}/_/${encodedTrackName}`
    );
  };

  getRelatedArtistName = (index: number) => {
    const apiObject = (
      this.getDataSource()[index] as { artist: LastFMUserArtistInterface }
    )?.artist;
    return this.withDefault(apiObject?.name, this.defaultArtistName);
  };
}
