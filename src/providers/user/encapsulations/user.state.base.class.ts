import type { LastFMImageDataInterface } from "../../../types/integrations/lastfm/api.types";
import type { UserStateInterface } from "../../../types/user/state.types";
import type { TFunction } from "next-i18next";

export default abstract class UserState {
  defaultAlbumName: string;
  defaultArtistName: string;
  lastfmPrefix = "https://last.fm/music";
  userProperties: UserStateInterface;

  constructor(userProperties: UserStateInterface, t: TFunction) {
    this.userProperties = userProperties;
    this.defaultAlbumName = t("defaults.albumName");
    this.defaultArtistName = t("defaults.artistName");
  }

  abstract getDataSource(): unknown[];

  abstract getExternalLink(index: number): string;

  getArtwork = (
    index: number,
    size: LastFMImageDataInterface["size"]
  ): string => {
    let image = "";
    const apiObject = this.getDataSource()[index] as {
      image: LastFMImageDataInterface[];
    };
    if (apiObject && apiObject.image) {
      const result = apiObject.image.find(
        (img: LastFMImageDataInterface) => img.size === size
      );
      if (result) image = result["#text"];
    }
    return image;
  };

  getName = (index: number) => {
    const apiObject = this.getDataSource()[index] as {
      name?: string;
    };
    return this.withDefault(apiObject?.name, this.defaultAlbumName);
  };

  getPlayCount = (index: number) => {
    const playCount = (this.getDataSource()[index] as { playcount?: string })
      ?.playcount;
    return this.withDefault(playCount, "0");
  };

  withDefault = (value?: string, defaultValue?: string) => {
    if (value) return value;
    return defaultValue as string;
  };
}
