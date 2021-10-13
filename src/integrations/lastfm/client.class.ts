import LastFm from "@toplast/lastfm";
import { ProxyError } from "../../errors/proxy.error.class";
import type {
  LastFMAlbumDataInterface,
  LastFMArtistDataInterface,
  LastFMImageDataInterface,
} from "../../types/integrations/lastfm/api.types";
import type {
  LastFMClientInterface,
  LastFMExternalClientError,
} from "../../types/integrations/lastfm/client.types";

class LastFmClientAdapter implements LastFMClientInterface {
  externalClient: LastFm;
  secret_key: string;
  reportCount = 20;
  reportPeriod = "overall" as const;

  constructor(secret_key: string) {
    this.secret_key = secret_key;
    this.externalClient = new LastFm(this.secret_key);
  }

  private createProxyCompatibleError(
    err: LastFMExternalClientError
  ): ProxyError {
    return new ProxyError(err.message, err.statusCode);
  }

  async getTopAlbums(username: string): Promise<LastFMAlbumDataInterface[]> {
    try {
      const response = await this.externalClient.user.getTopAlbums({
        user: username,
        period: this.reportPeriod,
        limit: this.reportCount,
        page: 1,
      });
      return response.topalbums.album as LastFMAlbumDataInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }

  async getTopArtists(username: string): Promise<LastFMArtistDataInterface[]> {
    try {
      const response = await this.externalClient.user.getTopArtists({
        user: username,
        period: this.reportPeriod,
        limit: this.reportCount,
        page: 1,
      });
      // TODO: solution for artist artwork
      // user music brainz to get the artist image
      // http://musicbrainz.org/ws/2/artist/f27ec8db-af05-4f36-916e-3d57f91ecf5e?inc=url-rels

      // for each artist, query music brainz, get the spotify id
      // query spotify, get the image...

      return response.topartists.artist as LastFMArtistDataInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }

  async getUserImage(username: string): Promise<LastFMImageDataInterface[]> {
    try {
      const response = await this.externalClient.user.getInfo({
        user: username,
      });
      return response.user.image as LastFMImageDataInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }
}

export default LastFmClientAdapter;
