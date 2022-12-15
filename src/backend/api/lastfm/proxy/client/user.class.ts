import LastFMClientAdapterBase from "./bases/client.base.class";
import ArtistImageCacheFactory from "../cache/artist.image.cache.controller.factory.class";
import type { CacheControllerInterface } from "@src/backend/types/cache/controller.types";
import type {
  LastFMAlbumDataInterface,
  LastFMArtistDataInterface,
  LastFMImageDataInterface,
  LastFMTrackDataInterface,
  LastFMUserProfileInterface,
} from "@src/types/integrations/lastfm/api.types";
import type {
  LastFMUserClientInterface,
  LastFMExternalClientError,
} from "@src/types/integrations/lastfm/client.types";
import type { Await } from "@src/types/promise.types";
class LastFmUserClientAdapter
  extends LastFMClientAdapterBase
  implements LastFMUserClientInterface
{
  cache: CacheControllerInterface<string>;
  reportCount = 20;
  reportPeriod = "overall" as const;

  constructor(secret_key: string) {
    super(secret_key);
    const cacheFactory = new ArtistImageCacheFactory();
    this.cache = cacheFactory.create();
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
      this.cache.logCacheHitRate();
      return response.topartists.artist as LastFMArtistDataInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }

  protected async attachArtistArtwork(artists: LastFMAlbumDataInterface[]) {
    const cacheLookups: Promise<string>[] = [];
    artists.map((artist) => {
      cacheLookups.push(this.cache.query(artist.name));
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

  async getTopTracks(username: string): Promise<LastFMTrackDataInterface[]> {
    try {
      const response = await this.externalClient.user.getTopTracks({
        user: username,
        period: this.reportPeriod,
        limit: this.reportCount,
        page: 1,
      });
      await this.attachTrackArtistArtwork(
        response.toptracks.track as LastFMTrackDataInterface[]
      );
      this.cache.logCacheHitRate();
      return response.toptracks.track as LastFMTrackDataInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }

  protected async attachTrackArtistArtwork(tracks: LastFMTrackDataInterface[]) {
    const cacheLookups: Promise<string>[] = [];
    tracks.map((track) => {
      cacheLookups.push(this.cache.query(track.artist?.name));
    });

    await Promise.all(cacheLookups).then((urls) => {
      tracks.map((track) => {
        const artistImage = urls.shift() as Await<string>;
        if (track.name && track.image) {
          track.image.map((image) => {
            image["#text"] = artistImage;
          });
        }
      });
    });
  }

  async getUserProfile(username: string): Promise<LastFMUserProfileInterface> {
    try {
      const response = await this.externalClient.user.getInfo({
        user: username,
      });
      return {
        image: response.user.image as LastFMImageDataInterface[],
        playcount: parseInt(response.user.playcount),
      };
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }
}

export default LastFmUserClientAdapter;
