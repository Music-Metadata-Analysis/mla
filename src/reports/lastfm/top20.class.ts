import type { LastFMImageDataInterface } from "../../types/integrations/lastfm/api.types";
import type { UserStateInterface } from "../../types/user/state.types";

export default class LastFMTop20AlbumReport {
  userProperties: UserStateInterface;

  constructor(userProperties: UserStateInterface) {
    this.userProperties = userProperties;
  }

  getAlbumArtWork = (index: number, size: string): string => {
    let image = "";
    const album = this.userProperties.data.report.albums[index];
    if (album && album.image) {
      const result = album.image.find(
        (img: LastFMImageDataInterface) => img.size === size
      );
      if (result) image = result["#text"];
    }
    return image;
  };
}
