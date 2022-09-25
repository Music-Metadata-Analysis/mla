import PlayCountByArtistNode from "./playcount.artists.node.class";
import SunBurstDrawer from "../common/sunburst.report.drawer/sunburst.report.drawer.component";
import SunBurstBaseReport from "../common/sunburst.report/sunburst.report.base.class";
import routes from "@src/config/routes";
import PlayCountByArtistState from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import type { PlayCountByArtistReportInterface } from "@src/types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/integrations/base.types";

export default class PlayCountByArtistReport extends SunBurstBaseReport<PlayCountByArtistState> {
  drawerComponent = SunBurstDrawer;
  analyticsReportType = "PLAYCOUNT BY ARTIST" as const;
  encapsulationClass = PlayCountByArtistState;
  nodeEncapsulationClass = PlayCountByArtistNode;
  translationKey = "playCountByArtist" as const;
  retryRoute = routes.search.lastfm.playCountByArtist;
  hookMethod = "playCountByArtist" as const;
  entityKeys = ["artists" as const, "albums" as const, "tracks" as const];

  getReportData(userProperties: PlayCountByArtistState["userProperties"]) {
    return userProperties.data.report
      .playCountByArtist as AggregateBaseReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
