import LastFm from "@toplast/lastfm";
import S3Cache from "./s3cache.class";
import { ProxyError } from "../../../errors/proxy.error.class";
import type {
  LastFMAlbumDataInterface,
  LastFMArtistDataInterface,
  LastFMImageDataInterface,
} from "../../../types/integrations/lastfm/api.types";
import type {
  LastFMClientInterface,
  LastFMExternalClientError,
} from "../../../types/integrations/lastfm/client.types";
import type { Await } from "../../../types/promise.types";

class LastFmClientAdapter implements LastFMClientInterface {
  externalClient: LastFm;
  cache: S3Cache;
  secret_key: string;
  reportCount = 20;
  reportPeriod = "overall" as const;

  constructor(secret_key: string) {
    this.secret_key = secret_key;
    this.externalClient = new LastFm(this.secret_key);
    this.cache = new S3Cache(process.env.LASTFM_CACHE_AWS_S3_BUCKET_NAME);
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
      await this.attachArtistArtwork(
        response.topartists.artist as LastFMArtistDataInterface[]
      );
      return response.topartists.artist as LastFMArtistDataInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }

  private async attachArtistArtwork(artists: LastFMAlbumDataInterface[]) {
    const cacheLookups: Promise<string>[] = [];
    artists.map((artist) => {
      cacheLookups.push(this.cache.lookup(artist.name));
    });

    await Promise.all(cacheLookups).then((urls) => {
      artists.map((artist) => {
        const artistImage = urls.shift() as Await<string>;
        if (artist.name && artist.image) {
          artist.image.map((image) => {
            image["#text"] = artistImage;
          });
        }
      });
    });
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
