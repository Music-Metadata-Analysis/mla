import LastFMReportPlayCountByArtistStateEncapsulation from "../encapsulations/lastfm.report.encapsulation.playcount.by.artist.class";
import routes from "@src/config/routes";
import SunBurstDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/sunburst/sunburst.report.drawer.container";
import SunBurstBaseQuery from "@src/web/reports/lastfm/generics/state/queries/sunburst.query.base.class";
import PlayCountByArtistNodeEncapsulation from "@src/web/reports/lastfm/playcount.by.artist/state/charts/sunburst/playcount.by.artist.node.class";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.by.artist/types/state/aggregate.report.types";

export default class PlayCountByArtistQuery extends SunBurstBaseQuery<LastFMReportPlayCountByArtistStateEncapsulation> {
  protected drawerComponent = SunBurstDrawerContainer;
  protected analyticsReportType = "PLAYCOUNT BY ARTIST" as const;
  protected encapsulationClass =
    LastFMReportPlayCountByArtistStateEncapsulation;
  protected nodeEncapsulationClass = PlayCountByArtistNodeEncapsulation;
  protected translationKey = "playCountByArtist" as const;
  protected retryRoute = routes.search.lastfm.playCountByArtist;
  protected hookMethod = "playCountByArtist" as const;
  protected entityKeys = [
    "artists" as const,
    "albums" as const,
    "tracks" as const,
  ];

  getReportData(
    reportProperties: LastFMReportPlayCountByArtistStateEncapsulation["reportProperties"]
  ) {
    return reportProperties.data.report
      .playCountByArtist as LastFMAggregateReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }
}
