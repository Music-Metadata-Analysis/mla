import LastFMClientAdapter from "./client.class";
import type { LastFMProxyInterface } from "../../../types/integrations/lastfm/proxy.types";

class LastFMProxy implements LastFMProxyInterface {
  private internalClient: LastFMClientAdapter;

  constructor() {
    this.internalClient = new LastFMClientAdapter(process.env.LAST_FM_KEY);
  }

  async getTopAlbums(username: string) {
    const [albums, profile] = await Promise.all([
      this.internalClient.getTopAlbums(username),
      this.internalClient.getUserProfile(username),
    ]);

    return {
      albums,
      image: profile.image,
      playcount: profile.playcount,
    };
  }

  async getTopArtists(username: string) {
    const [artists, profile] = await Promise.all([
      this.internalClient.getTopArtists(username),
      this.internalClient.getUserProfile(username),
    ]);
    return {
      artists,
      image: profile.image,
      playcount: profile.playcount,
    };
  }

  async getTopTracks(username: string) {
    const [tracks, profile] = await Promise.all([
      this.internalClient.getTopTracks(username),
      this.internalClient.getUserProfile(username),
    ]);
    return {
      tracks,
      image: profile.image,
      playcount: profile.playcount,
    };
  }
}

export default LastFMProxy;
