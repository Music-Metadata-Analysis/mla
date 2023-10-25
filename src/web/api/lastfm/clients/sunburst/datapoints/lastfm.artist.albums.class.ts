import LastFMBaseSunBurstDataPointClient from "../../bases/lastfm.api.sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMArtistTopAlbumsInterface } from "@src/contracts/api/types/services/lastfm/responses/datapoints/artist.topalbums.types";

class LastFMArtistGetAlbums<
  EncapsulationType,
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMArtistTopAlbumsInterface
> {
  route = apiRoutes.v2.data.lastfm.artists.albumsList;
}

export default LastFMArtistGetAlbums;
