import LastFMBaseSunBurstDataPointClient from "./sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMTrackInfoInterface } from "@src/types/integrations/lastfm/api.types";

class LastFMTrackInfo<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMTrackInfoInterface
> {
  route = apiRoutes.v2.data.artists.tracksGet;
  eventType = "TRACK INFO" as const;
}

export default LastFMTrackInfo;
