import LastFMClientAdapterBase from "./client.base.class";
import type { LastFMArtistTopAlbumsInterface } from "../../../../types/integrations/lastfm/api.types";
import type {
  LastFMExternalClientError,
  LastFMArtistClientInterface,
} from "../../../../types/integrations/lastfm/client.types";

class LastFmArtistClientAdapter
  extends LastFMClientAdapterBase
  implements LastFMArtistClientInterface
{
  reportCount = 20;

  async getTopAlbums(
    artist: string
  ): Promise<LastFMArtistTopAlbumsInterface[]> {
    try {
      const response = await this.externalClient.artist.getTopAlbums({
        artist,
        limit: this.reportCount,
        page: 1,
      });
      return response.topalbums.album as LastFMArtistTopAlbumsInterface[];
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }
}

export default LastFmArtistClientAdapter;
