import LastFMClientAdapterBase from "./bases/client.base.class";
import ArtistImageCacheFactory from "../cache/artist.image.cache.controller.factory.class";
import type { CacheControllerInterface } from "@src/backend/api/types/cache/controller.types";
import type { LastFMVendorClientError } from "@src/backend/api/types/integrations/lastfm/vendor.types";
import type { LastFMUserClientInterface } from "@src/backend/api/types/services/lastfm/client.types";
import type {
  LastFMImageDataInterface,
  LastFMUserProfileInterface,
} from "@src/contracts/api/exports/lastfm/element.types";
import type {
  LastFMUserAlbumInterface,
  LastFMUserArtistInterface,
  LastFMUserTrackInterface,
} from "@src/contracts/api/exports/lastfm/report.types";
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

  async getTopAlbums(username: string): Promise<LastFMUserAlbumInterface[]> {
    try {
      const response = await this.externalClient.user.getTopAlbums({
        user: username,
        period: this.reportPeriod,
        limit: this.reportCount,
        page: 1,
      });
      return response.topalbums.album as LastFMUserAlbumInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMVendorClientError);
    }
  }

  async getTopArtists(username: string): Promise<LastFMUserArtistInterface[]> {
    try {
      const response = await this.externalClient.user.getTopArtists({
        user: username,
        period: this.reportPeriod,
        limit: this.reportCount,
        page: 1,
      });
      await this.attachArtistArtwork(
        response.topartists.artist as LastFMUserArtistInterface[]
      );
      this.cache.logCacheHitRate();
      return response.topartists.artist as LastFMUserArtistInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMVendorClientError);
    }
  }

  protected async attachArtistArtwork(artists: LastFMUserAlbumInterface[]) {
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

  async getTopTracks(username: string): Promise<LastFMUserTrackInterface[]> {
    try {
      const response = await this.externalClient.user.getTopTracks({
        user: username,
        period: this.reportPeriod,
        limit: this.reportCount,
        page: 1,
      });
      await this.attachTrackArtistArtwork(
        response.toptracks.track as LastFMUserTrackInterface[]
      );
      this.cache.logCacheHitRate();
      return response.toptracks.track as LastFMUserTrackInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMVendorClientError);
    }
  }

  protected async attachTrackArtistArtwork(tracks: LastFMUserTrackInterface[]) {
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
      throw this.createProxyCompatibleError(err as LastFMVendorClientError);
    }
  }
}

export default LastFmUserClientAdapter;
