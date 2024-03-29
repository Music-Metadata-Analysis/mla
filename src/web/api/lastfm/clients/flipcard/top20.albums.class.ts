import LastFMReportBaseClient from "../bases/lastfm.api.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";

class LastFMTopAlbumsReport extends LastFMReportBaseClient<LastFMTopAlbumsReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20albums;
  eventType = "TOP20 ALBUMS" as const;
}

export default LastFMTopAlbumsReport;
