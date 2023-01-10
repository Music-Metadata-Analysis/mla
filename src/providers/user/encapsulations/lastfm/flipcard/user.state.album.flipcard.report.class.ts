import UserFlipCardBaseReportState from "./user.state.base.flipcard.report.class";
import Events from "@src/events/events";
import type { LastFMUserArtistInterface } from "@src/types/clients/api/lastfm/response.types";
import type { LastFMUserStateAlbumReport } from "@src/types/user/state.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

export default class UserAlbumState extends UserFlipCardBaseReportState {
  userProperties: LastFMUserStateAlbumReport;

  constructor(userProperties: LastFMUserStateAlbumReport, t: tFunctionType) {
    super(userProperties, t);
    this.userProperties = userProperties;
  }

  getDataSource = () => this.userProperties.data.report.albums;

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
