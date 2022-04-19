import LastFMBaseReport from "./lastfm.base.class";
import apiRoutes from "../../../../config/apiRoutes";
import type { LastFMTopTracksReportResponseInterface } from "../../../../types/clients/api/reports/lastfm.client.types";

class LastFMTopTracksReport extends LastFMBaseReport<LastFMTopTracksReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20tracks;
  eventType = "TOP20 TRACKS" as const;
}

export default LastFMTopTracksReport;
