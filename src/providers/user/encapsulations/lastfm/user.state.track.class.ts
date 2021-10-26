import UserBaseReportState from "./user.state.base.report.class";
import Events from "../../../../events/events";
import type { LastFMArtistDataInterface } from "../../../../types/integrations/lastfm/api.types";
import type { LastFMUserStateTrackReport } from "../../../../types/user/state.types";
import type { TFunction } from "next-i18next";

export default class UserTrackState extends UserBaseReportState {
  userProperties: LastFMUserStateTrackReport;

  constructor(userProperties: LastFMUserStateTrackReport, t: TFunction) {
    super(userProperties, t);
    this.userProperties = userProperties;
  }

  getDataSource = () => this.userProperties.data.report.tracks;

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
      this.getDataSource()[index] as { artist: LastFMArtistDataInterface }
    )?.artist;
    return this.withDefault(apiObject?.name, this.defaultArtistName);
  };
}
