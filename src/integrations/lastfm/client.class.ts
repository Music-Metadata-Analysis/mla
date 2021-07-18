import LastFm from "@toplast/lastfm";
import {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "../../types/lastfm.types";
import { LastFMClientInterface } from "../../types/lastfm.types";
import { ProxyError } from "../../errors/proxy.error.class";

class LastFmClient implements LastFMClientInterface {
  externalClient: LastFm;
  secret_key: string;
  reportAlbumCount = 20;
  reportAlbumPeriod = "overall" as "overall";

  constructor(secret_key: string) {
    this.secret_key = secret_key;
    this.externalClient = new LastFm(this.secret_key);
  }

  private createProxyCompatibleError(err: {
    message: string;
    response: { status: number };
    clientStatusCode: number;
  }): ProxyError {
    if (err.response) return new ProxyError(err.message, err.response.status);
    return new ProxyError(err.message, undefined);
  }

  async getTopAlbums(username: string): Promise<LastFMAlbumDataInterface[]> {
    try {
      const topAlbums = await this.externalClient.user.getTopAlbums({
        user: username,
        period: this.reportAlbumPeriod,
        limit: this.reportAlbumCount,
        page: 1,
      });
      return topAlbums.topalbums.album as LastFMAlbumDataInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err);
    }
  }

  async getUserImage(username: string): Promise<LastFMImageDataInterface[]> {
    try {
      const info = await this.externalClient.user.getInfo({
        user: username,
      });
      return info.user.image as LastFMImageDataInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err);
    }
  }
}

export default LastFmClient;
