import LastFMBaseSunBurstDataPointClient from "../../bases/lastfm.api.sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMArtistTopAlbumsInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

class LastFMArtistGetAlbums<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMArtistTopAlbumsInterface
> {
  route = apiRoutes.v2.data.artists.albumsList;
}

export default LastFMArtistGetAlbums;
