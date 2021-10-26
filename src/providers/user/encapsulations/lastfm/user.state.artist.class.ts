import UserBaseReportState from "./user.state.base.report.class";
import Events from "../../../../events/events";
import type { LastFMUserStateArtistReport } from "../../../../types/user/state.types";
import type { TFunction } from "next-i18next";

export default class UserArtistState extends UserBaseReportState {
  userProperties: LastFMUserStateArtistReport;

  constructor(userProperties: LastFMUserStateArtistReport, t: TFunction) {
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
