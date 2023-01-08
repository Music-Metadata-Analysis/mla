import LastFMBaseSunBurstDataPointClient from "./sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMArtistTopAlbumsInterface } from "@src/types/clients/api/lastfm/response.types";

class LastFMArtistGetAlbums<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMArtistTopAlbumsInterface
> {
  route = apiRoutes.v2.data.artists.albumsList;
}

export default LastFMArtistGetAlbums;
