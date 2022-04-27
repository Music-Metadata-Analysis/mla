import apiRoutes from "../../../../config/apiRoutes";
import LastFMBaseClient from "../lastfm.api.client.base.class";
import type { LastFMTopArtistsReportResponseInterface } from "../../../../types/clients/api/lastfm/response.types";

class LastFMTopArtistsReport extends LastFMBaseClient<LastFMTopArtistsReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20artists;
  eventType = "TOP20 ARTISTS" as const;
}

export default LastFMTopArtistsReport;
