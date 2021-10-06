import UserState from "./user.state.base.class";
import type { LastFMArtistDataInterface } from "../../../types/integrations/lastfm/api.types";
import type { LastFMUserStateTop20AlbumReport } from "../../../types/user/state.types";
import type { TFunction } from "next-i18next";

export default class UserAlbumState extends UserState {
  userProperties: LastFMUserStateTop20AlbumReport;

  constructor(userProperties: LastFMUserStateTop20AlbumReport, t: TFunction) {
    super(userProperties, t);
    this.userProperties = userProperties;
  }

  getDataSource = () => this.userProperties.data.report.albums;

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
      this.getDataSource()[index] as { artist: LastFMArtistDataInterface }
    )?.artist;
    return this.withDefault(apiObject?.name, this.defaultArtistName);
  };
}
