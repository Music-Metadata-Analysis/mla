import routes from "@src/config/routes";
import PlayCountByArtistState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import SunBurstDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/sunburst/sunburst.report.drawer.container";
import SunBurstBaseReport from "@src/web/reports/lastfm/generics/state/queries/sunburst.query.base.class";
import PlayCountByArtistNodeEncapsulation from "@src/web/reports/lastfm/playcount.artists/state/charts/sunburst/playcount.artists.node.class";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.artists/types/state/aggregate.report.types";

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
      .playCountByArtist as LastFMAggregateReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
