import apiRoutes from "../../../../config/apiRoutes";
import LastFMBaseClient from "../lastfm.api.client.base.class";
import type { LastFMTopAlbumsReportResponseInterface } from "../../../../types/clients/api/lastfm/response.types";

class LastFMTopAlbumsReport extends LastFMBaseClient<LastFMTopAlbumsReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20albums;
  eventType = "TOP20 ALBUMS" as const;
}

export default LastFMTopAlbumsReport;
