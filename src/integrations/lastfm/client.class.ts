import LastFm from "@toplast/lastfm";
import {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "../../types/lastfm.types";
import { LastFMClientInterface } from "../../types/lastfm.types";

class LastFmClient implements LastFMClientInterface {
  externalClient: LastFm;
  secret_key: string;
  reportAlbumCount = 20;
  reportAlbumPeriod = "overall" as "overall";

  constructor(secret_key: string) {
    this.secret_key = secret_key;
    this.externalClient = new LastFm(this.secret_key);
  }

  async getTopAlbums(username: string): Promise<LastFMAlbumDataInterface[]> {
    const topAlbums = await this.externalClient.user.getTopAlbums({
      user: username,
      period: this.reportAlbumPeriod,
      limit: this.reportAlbumCount,
      page: 1,
    });
    return topAlbums.topalbums.album as LastFMAlbumDataInterface[];
  }

  async getUserImage(username: string): Promise<LastFMImageDataInterface[]> {
    const info = await this.externalClient.user.getInfo({
      user: username,
    });
    return info.user.image as LastFMImageDataInterface[];
  }
}

export default LastFmClient;
