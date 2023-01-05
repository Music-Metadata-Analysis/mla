import LastFMBaseSunBurstDataPointClient from "./sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMTrackInfoInterface } from "@src/contracts/api/exports/lastfm/datapoint.types";

class LastFMTrackInfo<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMTrackInfoInterface
> {
  route = apiRoutes.v2.data.artists.tracksGet;
}

export default LastFMTrackInfo;
