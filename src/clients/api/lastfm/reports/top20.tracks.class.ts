import apiRoutes from "../../../../config/apiRoutes";
import LastFMBaseClient from "../lastfm.api.client.base.class";
import type { LastFMTopTracksReportResponseInterface } from "../../../../types/clients/api/lastfm/response.types";

class LastFMTopTracksReport extends LastFMBaseClient<LastFMTopTracksReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20tracks;
  eventType = "TOP20 TRACKS" as const;
}

export default LastFMTopTracksReport;
