import LastFMClientAdapterBase from "./bases/client.base.class";
import type { LastFMTrackClientInterface } from "@src/backend/api/types/services/lastfm/client.types";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/exports/lastfm/datapoint.types";
import type { LastFMVendorClientError } from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

class LastFmTrackClientAdapter
  extends LastFMClientAdapterBase
  implements LastFMTrackClientInterface
{
  async getInfo(
    artist: string,
    track: string,
    username: string
  ): Promise<LastFMTrackInfoInterface> {
    try {
      const response = await this.externalClient.track.getInfo({
        artist,
        track,
        username,
      });
      return response.track as LastFMTrackInfoInterface;
    } catch (err) {
      throw this.createProxyCompatibleError(err as LastFMVendorClientError);
    }
  }
}

export default LastFmTrackClientAdapter;
