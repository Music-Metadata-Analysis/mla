import UserState from "./user.state.base.class";
import type {
  LastFMImageDataInterface,
  LastFMAlbumDataInterface,
} from "../../../types/integrations/lastfm/api.types";
import type { UserStateInterface } from "../../../types/user/state.types";
import type { TFunction } from "next-i18next";

export default class UserAlbumState extends UserState {
  albums: LastFMAlbumDataInterface[];

  constructor(userProperties: UserStateInterface, t: TFunction) {
    super(userProperties, t);
    this.albums = userProperties.data.report
      .albums as LastFMAlbumDataInterface[];
  }

  getAlbumArtWork = (
    index: number,
    size: LastFMImageDataInterface["size"]
  ): string => {
    let image = "";
    const album = this.albums[index];
    if (album && album.image) {
      const result = album.image.find(
        (img: LastFMImageDataInterface) => img.size === size
      );
      if (result) image = result["#text"];
    }
    return image;
  };

  getAlbumExternalLink = (index: number) => {
    const album = this.albums[index];
    const encodedAlbumName = encodeURIComponent(this.getAlbumName(index));
    const encodedArtistName = encodeURIComponent(this.getArtistName(index));
    return this.withDefault(
      album?.url,
      `${this.lastfmPrefix}/${encodedArtistName}/${encodedAlbumName}`
    );
  };

  getAlbumName = (index: number) => {
    const album = this.albums[index];
    return this.withDefault(album?.name, this.defaultAlbumName);
  };

  getArtistName = (index: number) => {
    const artist = this.albums[index]?.artist;
    return this.withDefault(artist?.name, this.defaultArtistName);
  };

  getPlayCount = (index: number) => {
    const playCount = this.albums[index]?.playcount;
    return this.withDefault(playCount, "0");
  };

  private withDefault = (value?: string, defaultValue?: string) => {
    if (value) return value;
    return defaultValue as string;
  };
}
