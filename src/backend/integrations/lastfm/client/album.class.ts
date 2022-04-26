import LastFMClientAdapterBase from "./client.base.class";
import type { LastFMAlbumInfoInterface } from "../../../../types/integrations/lastfm/api.types";
import type {
  LastFMExternalClientError,
  LastFMAlbumClientInterface,
} from "../../../../types/integrations/lastfm/client.types";

class LastFmAlbumClientAdapter
  extends LastFMClientAdapterBase
  implements LastFMAlbumClientInterface
{
  async getInfo(
    artist: string,
    album: string,
    username: string
  ): Promise<LastFMAlbumInfoInterface> {
    try {
      const response = await this.externalClient.album.getInfo({
        album,
        artist,
        username,
      });
      return response.album as LastFMAlbumInfoInterface;
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMExternalClientError);
    }
  }
}

export default LastFmAlbumClientAdapter;
