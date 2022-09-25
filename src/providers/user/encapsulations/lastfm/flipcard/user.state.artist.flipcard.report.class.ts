import UserFlipCardBaseReportState from "./user.state.base.flipcard.report.class";
import Events from "@src/events/events";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { LastFMUserStateArtistReport } from "@src/types/user/state.types";

export default class UserArtistState extends UserFlipCardBaseReportState {
  userProperties: LastFMUserStateArtistReport;

  constructor(userProperties: LastFMUserStateArtistReport, t: tFunctionType) {
    super(userProperties, t);
    this.userProperties = userProperties;
  }

  getDataSource = () => this.userProperties.data.report.artists;

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
