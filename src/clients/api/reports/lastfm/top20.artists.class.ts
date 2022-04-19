import LastFMBaseReport from "./lastfm.base.class";
import apiRoutes from "../../../../config/apiRoutes";
import type { LastFMTopArtistsReportResponseInterface } from "../../../../types/clients/api/reports/lastfm.client.types";

class LastFMTopArtistsReport extends LastFMBaseReport<LastFMTopArtistsReportResponseInterface> {
  route = apiRoutes.v2.reports.lastfm.top20artists;
  eventType = "TOP20 ARTISTS" as const;
}

export default LastFMTopArtistsReport;
