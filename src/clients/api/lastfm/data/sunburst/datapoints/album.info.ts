import LastFMBaseSunBurstDataPointClient from "./sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMAlbumInfoInterface } from "@src/contracts/api/exports/lastfm/datapoint.types";

class LastFMAlbumInfo<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMAlbumInfoInterface
> {
  route = apiRoutes.v2.data.artists.albumsGet;
}

export default LastFMAlbumInfo;
