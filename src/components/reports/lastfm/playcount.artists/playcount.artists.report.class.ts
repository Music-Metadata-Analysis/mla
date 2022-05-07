import routes from "../../../../config/routes";
import PlayCountByArtistState from "../../../../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import SunBurstBaseReport from "../common/sunburst.report/sunburst.report.base.class";
import type { PlayCountByArtistReportInterface } from "../../../../types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "../../../../types/integrations/base.types";

export default class PlayCountByArtistReport extends SunBurstBaseReport<PlayCountByArtistState> {
  analyticsReportType = "PLAYCOUNT BY ARTIST" as const;
  encapsulationClass = PlayCountByArtistState;
  translationKey = "playCountByArtist" as const;
  retryRoute = routes.search.lastfm.top20albums;
  hookMethod = "playCountByArtist" as const;

  getReportData(userProperties: PlayCountByArtistState["userProperties"]) {
    return userProperties.data.report
      .playCountByArtist as AggregateBaseReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
