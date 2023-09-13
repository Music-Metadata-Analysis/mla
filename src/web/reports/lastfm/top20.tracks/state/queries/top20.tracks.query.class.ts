import routes from "@src/config/routes";
import FlipCardDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/flip.card/flip.card.report.drawer.container";
import FlipCardAbstractBaseQuery from "@src/web/reports/lastfm/generics/state/queries/flip.card.query.base.class";
import LastFMReportFlipCardTopTracksStateEncapsulation from "@src/web/reports/lastfm/top20.tracks/state/encapsulations/lastfm.report.encapsulation.top.tracks.flipcard.class";
import type { LastFMTopTracksReportResponseInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

export default class Top20TracksQuery extends FlipCardAbstractBaseQuery<
  LastFMReportFlipCardTopTracksStateEncapsulation,
  LastFMTopTracksReportResponseInterface["tracks"]
> {
  protected analyticsReportType = "TOP20 TRACKS" as const;
  protected drawerArtWorkAltTextTranslationKey =
    "top20Tracks.drawer.artWorkAltText";
  protected drawerComponent = FlipCardDrawerContainer;
  protected encapsulationClass =
    LastFMReportFlipCardTopTracksStateEncapsulation;
  protected hookMethod = "top20tracks" as const;
  protected retryRoute = routes.search.lastfm.top20tracks;
  protected translationKey = "top20Tracks" as const;

  getNumberOfImageLoads = (
    reportProperties: LastFMReportFlipCardTopTracksStateEncapsulation["reportProperties"]
  ) => {
    return this.getReportData(reportProperties).length * 2;
  };

  getReportData(
    reportProperties: LastFMReportFlipCardTopTracksStateEncapsulation["reportProperties"]
  ) {
    return reportProperties.data.report.tracks;
  }
}
