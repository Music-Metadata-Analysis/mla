import LastFMReportBaseClient from "../lastfm.api.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMTopTracksReportResponseInterface } from "@src/types/clients/api/lastfm/response.types";

class LastFMTopTracksReport extends LastFMReportBaseClient<LastFMTopTracksReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20tracks;
  eventType = "TOP20 TRACKS" as const;
}

export default LastFMTopTracksReport;
