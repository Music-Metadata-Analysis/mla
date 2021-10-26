import UserBaseState from "./user.state.base.class";
import type EventDefinition from "../../../../events/event.class";
import type { LastFMImageDataInterface } from "../../../../types/integrations/lastfm/api.types";
import type { LastFMUserStateBase } from "../../../../types/user/state.types";
import type { TFunction } from "next-i18next";

export default abstract class UserBaseReportState extends UserBaseState {
  defaultAlbumName: string;
  defaultArtistName: string;
  defaultTrackName: string;
  lastfmPrefix = "https://last.fm/music";

  constructor(userProperties: LastFMUserStateBase, t: TFunction) {
    super(userProperties);
    this.defaultAlbumName = t("defaults.albumName");
    this.defaultArtistName = t("defaults.artistName");
    this.defaultTrackName = t("defaults.trackName");
  }

  abstract getDataSource(): unknown[];

  abstract getDefaultEntityName(): string;

  abstract getDrawerTitle(index: number): string;

  abstract getDrawerEvent(index: number): EventDefinition;

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
    return this.withDefault(apiObject?.name, this.getDefaultEntityName());
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
