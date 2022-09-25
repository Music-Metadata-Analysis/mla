import LastFMBaseSunBurstDataPointClient from "./sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMArtistTopAlbumsInterface } from "@src/types/integrations/lastfm/api.types";

class LastFMArtistGetAlbums<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMArtistTopAlbumsInterface
> {
  route = apiRoutes.v2.data.artists.albumsList;
  eventType = "ARTIST GET ALBUMS" as const;
}

export default LastFMArtistGetAlbums;
