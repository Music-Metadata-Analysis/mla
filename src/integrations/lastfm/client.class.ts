import LastFm from "@toplast/lastfm";
import { ProxyError } from "../../errors/proxy.error.class";
import type {
  LastFMAlbumDataInterface,
  LastFMImageDataInterface,
} from "../../types/integrations/lastfm/api.types";
import type { LastFMClientInterface } from "../../types/integrations/lastfm/client.types";

class LastFmClientAdapter implements LastFMClientInterface {
  externalClient: LastFm;
  secret_key: string;
  reportAlbumCount = 20;
  reportAlbumPeriod = "overall" as const;

  constructor(secret_key: string) {
    this.secret_key = secret_key;
    this.externalClient = new LastFm(this.secret_key);
  }

  private createProxyCompatibleError(err: {
    message: string;
    statusCode: number | undefined;
  }): ProxyError {
    return new ProxyError(err.message, err.statusCode);
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

export default LastFmClientAdapter;
