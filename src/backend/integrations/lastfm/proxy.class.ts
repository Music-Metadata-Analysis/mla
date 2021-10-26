import LastFMClientAdapter from "./client.class";
import type { LastFMProxyInterface } from "../../../types/integrations/lastfm/proxy.types";

class LastFMProxy implements LastFMProxyInterface {
  private internalClient: LastFMClientAdapter;

  constructor() {
    this.internalClient = new LastFMClientAdapter(process.env.LAST_FM_KEY);
  }

  async getTopAlbums(username: string) {
    const [albums, image] = await Promise.all([
      this.internalClient.getTopAlbums(username),
      this.internalClient.getUserImage(username),
    ]);

    return {
      albums,
      image,
    };
  }

  async getTopArtists(username: string) {
    const [artists, image] = await Promise.all([
      this.internalClient.getTopArtists(username),
      this.internalClient.getUserImage(username),
    ]);
    return {
      artists,
      image,
    };
  }

  async getTopTracks(username: string) {
    const [tracks, image] = await Promise.all([
      this.internalClient.getTopTracks(username),
      this.internalClient.getUserImage(username),
    ]);
    return {
      tracks,
      image,
    };
  }
}

export default LastFMProxy;
