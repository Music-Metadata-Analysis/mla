import LastFMReportBaseClient from "../lastfm.api.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/web/api/lastfm/types/response.types";

class LastFMTopAlbumsReport extends LastFMReportBaseClient<LastFMTopAlbumsReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20albums;
  eventType = "TOP20 ALBUMS" as const;
}

export default LastFMTopAlbumsReport;
