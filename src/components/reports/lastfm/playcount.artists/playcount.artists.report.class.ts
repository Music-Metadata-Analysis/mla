import PlayCountByArtistNodeEncapsulation from "./playcount.artists.node.class";
import SunBurstDrawerContainer from "../common/drawer/sunburst/sunburst.report.drawer.container";
import SunBurstBaseReport from "@src/components/reports/lastfm/common/report.class/sunburst.report.base.class";
import routes from "@src/config/routes";
import PlayCountByArtistState from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import type { AggregateBaseReportResponseInterface } from "@src/types/reports/generics/aggregate.types";
import type { PlayCountByArtistReportInterface } from "@src/types/reports/lastfm/states/aggregates/playcount.by.artist.types";

export default class PlayCountByArtistReport extends SunBurstBaseReport<PlayCountByArtistState> {
  protected drawerComponent = SunBurstDrawerContainer;
  protected analyticsReportType = "PLAYCOUNT BY ARTIST" as const;
  protected encapsulationClass = PlayCountByArtistState;
  protected nodeEncapsulationClass = PlayCountByArtistNodeEncapsulation;
  protected translationKey = "playCountByArtist" as const;
  protected retryRoute = routes.search.lastfm.playCountByArtist;
  protected hookMethod = "playCountByArtist" as const;
  protected entityKeys = [
    "artists" as const,
    "albums" as const,
    "tracks" as const,
  ];

  getReportData(userProperties: PlayCountByArtistState["userProperties"]) {
    return userProperties.data.report
      .playCountByArtist as AggregateBaseReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
