import LastFMBaseSunBurstDataPointClient from "../../bases/lastfm.api.sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/track.info.types";

class LastFMTrackInfo<
  EncapsulationType,
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMTrackInfoInterface
> {
  route = apiRoutes.v2.data.lastfm.artists.tracksGet;
}

export default LastFMTrackInfo;
