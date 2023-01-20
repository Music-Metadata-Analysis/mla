import LastFMClientAdapterBase from "./bases/client.base.class";
import type { LastFMArtistClientInterface } from "@src/backend/api/types/services/lastfm/client.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/artist.topalbums.types";
import type { LastFMVendorClientError } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

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
      throw this.createProxyCompatibleError(err as LastFMVendorClientError);
    }
  }
}

export default LastFmArtistClientAdapter;
