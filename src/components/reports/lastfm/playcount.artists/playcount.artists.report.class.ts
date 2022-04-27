import routes from "../../../../config/routes";
import UserPlaycountByArtistState from "../../../../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import SunBurstBaseReport from "../common/sunburst.report/sunburst.report.base.class";
import type { PlayCountByArtistReportInterface } from "../../../../types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "../../../../types/integrations/base.types";

export default class PlayCountByArtistReport extends SunBurstBaseReport<UserPlaycountByArtistState> {
  analyticsReportType = "PLAYCOUNT BY ARTIST" as const;
  encapsulationClass = UserPlaycountByArtistState;
  translationKey = "playCountByArtist" as const;
  retryRoute = routes.search.lastfm.top20albums;
  hookMethod = "playCountByArtist" as const;

  getReportData(userProperties: UserPlaycountByArtistState["userProperties"]) {
    return userProperties.data.report
      .playCountByArtist as AggregateBaseReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
