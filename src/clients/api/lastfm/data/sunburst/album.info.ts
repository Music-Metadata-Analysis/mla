import LastFMBaseSunBurstDataClient from "./sunburst.data.client.base.class";
import apiRoutes from "../../../../../config/apiRoutes";
import type { LastFMAlbumInfoInterface } from "../../../../../types/integrations/lastfm/api.types";

class LastFMAlbumInfo extends LastFMBaseSunBurstDataClient<LastFMAlbumInfoInterface> {
  route = apiRoutes.v2.data.artists.albumsGet;
  eventType = "ALBUM INFO" as const;
}

export default LastFMAlbumInfo;
