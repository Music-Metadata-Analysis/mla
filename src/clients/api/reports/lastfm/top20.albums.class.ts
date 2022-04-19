import LastFMBaseReport from "./lastfm.base.class";
import apiRoutes from "../../../../config/apiRoutes";
import type { LastFMTopAlbumsReportResponseInterface } from "../../../../types/clients/api/reports/lastfm.client.types";

class LastFMTopAlbumsReport extends LastFMBaseReport<LastFMTopAlbumsReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20albums;
  eventType = "TOP20 ALBUMS" as const;
}

export default LastFMTopAlbumsReport;
