import LastFMBaseSunBurstDataPointClient from "./sunburst.datapoint.client.base.class";
import apiRoutes from "../../../../../../config/apiRoutes";
import type { LastFMTopArtistsReportResponseInterface } from "../../../../../../types/clients/api/lastfm/response.types";

class UserArtistsAndProfile<
  EncapsultationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsultationType,
  LastFMTopArtistsReportResponseInterface
> {
  route = apiRoutes.v2.reports.lastfm.top20artists;
  eventType = "TOP20 ARTISTS" as const;
}

export default UserArtistsAndProfile;
