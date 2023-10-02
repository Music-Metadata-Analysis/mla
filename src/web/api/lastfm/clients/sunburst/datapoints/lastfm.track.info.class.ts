import LastFMBaseSunBurstDataPointClient from "../../bases/lastfm.api.sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMTrackInfoInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

class LastFMTrackInfo<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMTrackInfoInterface
> {
  route = apiRoutes.v2.data.artists.tracksGet;
}

export default LastFMTrackInfo;