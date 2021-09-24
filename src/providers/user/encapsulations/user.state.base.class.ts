import type { UserStateInterface } from "../../../types/user/state.types";
import type { TFunction } from "next-i18next";

export default class UserState {
  defaultAlbumName: string;
  defaultArtistName: string;
  lastfmPrefix = "https://last.fm/music";
  userProperties: UserStateInterface;

  constructor(userProperties: UserStateInterface, t: TFunction) {
    this.userProperties = userProperties;
    this.defaultAlbumName = t("defaults.albumName");
    this.defaultArtistName = t("defaults.artistName");
  }
}
