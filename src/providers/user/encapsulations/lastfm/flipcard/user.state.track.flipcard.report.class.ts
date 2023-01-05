import UserFlipCardBaseReportState from "./user.state.base.flipcard.report.class";
import Events from "@src/events/events";
import type { LastFMUserArtistInterface } from "@src/types/clients/api/lastfm/response.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { LastFMUserStateTrackReport } from "@src/types/user/state.types";

export default class UserTrackState extends UserFlipCardBaseReportState {
  userProperties: LastFMUserStateTrackReport;

  constructor(userProperties: LastFMUserStateTrackReport, t: tFunctionType) {
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
      this.getDataSource()[index] as { artist: LastFMUserArtistInterface }
    )?.artist;
    return this.withDefault(apiObject?.name, this.defaultArtistName);
  };
}
