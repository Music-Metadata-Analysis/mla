import LastFMReportBaseClient from "../bases/lastfm.api.client.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { LastFMTopArtistsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.artists.types";

class LastFMTopArtistsReport extends LastFMReportBaseClient<LastFMTopArtistsReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20artists;
  eventType = "TOP20 ARTISTS" as const;
}

export default LastFMTopArtistsReport;
