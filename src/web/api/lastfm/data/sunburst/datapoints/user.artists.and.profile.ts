import LastFMBaseSunBurstDataPointClient from "./sunburst.datapoint.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMTopArtistsReportResponseInterface } from "@src/web/api/lastfm/types/lastfm/response.types";

class UserArtistsAndProfile<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMTopArtistsReportResponseInterface
> {
  route = apiRoutes.v2.reports.lastfm.top20artists;
}

export default UserArtistsAndProfile;
