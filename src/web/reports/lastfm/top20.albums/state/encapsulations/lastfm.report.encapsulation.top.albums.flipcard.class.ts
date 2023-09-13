import LastFMReportFlipCardBaseStateEncapsulation from "../../../generics/state/encapsulations/lastfm.report.encapsulation.flipcard.base.class";
import Events from "@src/web/analytics/collection/events/definitions";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { LastFMUserArtistInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";
import type { LastFMReportStateAlbumReport } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

export default class LastFMReportFlipCardTopAlbumsStateEncapsulation extends LastFMReportFlipCardBaseStateEncapsulation {
  reportProperties: LastFMReportStateAlbumReport;

  constructor(
    reportProperties: LastFMReportStateAlbumReport,
    t: tFunctionType
  ) {
    super(reportProperties, t);
    this.reportProperties = reportProperties;
  }

  getDataSource = () => this.reportProperties.data.report.albums;

  getDefaultEntityName = () => {
    return this.defaultAlbumName;
  };

  getDrawerTitle = (index: number) => {
    return `${this.getRelatedArtistName(index)}: ${this.getName(index)}`;
  };

  getDrawerEvent = (index: number) => {
    return Events.LastFM.AlbumViewed(
      this.getRelatedArtistName(index),
      this.getName(index)
    );
  };

  getExternalLink = (index: number) => {
    const apiObject = this.getDataSource()[index] as { url?: string };
    const encodedAlbumName = encodeURIComponent(this.getName(index));
    const encodedArtistName = encodeURIComponent(
      this.getRelatedArtistName(index)
    );
    return this.withDefault(
      apiObject?.url,
      `${this.lastfmPrefix}/${encodedArtistName}/${encodedAlbumName}`
    );
  };

  getRelatedArtistName = (index: number) => {
    const apiObject = (
      this.getDataSource()[index] as { artist: LastFMUserArtistInterface }
    )?.artist;
    return this.withDefault(apiObject?.name, this.defaultArtistName);
  };
}
