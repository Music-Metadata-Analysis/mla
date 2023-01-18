import LastFMClientAdapterBase from "./bases/client.base.class";
import type { LastFMAlbumClientInterface } from "@src/backend/api/types/services/lastfm/client.types";
import type { LastFMAlbumInfoInterface } from "@src/contracts/api/exports/lastfm/datapoint.types";
import type { LastFMVendorClientError } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

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
      throw this.createProxyCompatibleError(err as LastFMVendorClientError);
    }
  }
}

export default LastFmAlbumClientAdapter;
