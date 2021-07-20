import LastFMClient from "./client.class";
import type { LastFMProxyInterface } from "../../types/integrations/lastfm/proxy.types";

class LastFMProxy implements LastFMProxyInterface {
  private internalClient: LastFMClient;

  constructor() {
    this.internalClient = new LastFMClient(process.env.LAST_FM_KEY);
  }

  async getTopAlbums(username: string) {
    const albums = await this.internalClient.getTopAlbums(username);
    const image = await this.internalClient.getUserImage(username);

    return {
      albums,
      image,
    };
  }
}

export default LastFMProxy;
