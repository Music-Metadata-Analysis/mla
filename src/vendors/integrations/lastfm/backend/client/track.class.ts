import LastFMClientAdapterBase from "./bases/client.base.class";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/track.info.types";
import type {
  LastFMVendorClientError,
  LastFMVendorTrackClientInterface,
} from "@src/vendors/types/integrations/lastfm/vendor.backend.types";

class LastFmTrackClientAdapter
  extends LastFMClientAdapterBase
  implements LastFMVendorTrackClientInterface
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
