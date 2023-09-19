import routes from "@src/config/routes";
import FlipCardDrawerContainer from "@src/web/reports/lastfm/generics/components/report.drawer/flip.card/flip.card.report.drawer.container";
import FlipCardAbstractBaseQuery from "@src/web/reports/lastfm/generics/state/queries/flip.card.query.base.class";
import LastFMReportFlipCardTopArtistsStateEncapsulation from "@src/web/reports/lastfm/top20.artists/state/encapsulations/lastfm.report.encapsulation.top.artists.flipcard.class";
import type { LastFMTopArtistsReportResponseInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

export default class Top20AlbumsQuery extends FlipCardAbstractBaseQuery<
  LastFMReportFlipCardTopArtistsStateEncapsulation,
  LastFMTopArtistsReportResponseInterface["artists"]
> {
  protected analyticsReportType = "TOP20 ARTISTS" as const;
  protected drawerArtWorkAltTextTranslationKey =
    "top20Artists.drawer.artWorkAltText";
  protected drawerComponent = FlipCardDrawerContainer;
  protected encapsulationClass =
    LastFMReportFlipCardTopArtistsStateEncapsulation;
  protected hookMethod = "top20artists" as const;
  protected retryRoute = routes.search.lastfm.top20artists;
  protected translationKey = "top20Artists" as const;

  getNumberOfImageLoads = (
    reportProperties: LastFMReportFlipCardTopArtistsStateEncapsulation["reportProperties"]
  ) => {
    return this.getReportData(reportProperties).length * 2;
  };

  getReportData(
    reportProperties: LastFMReportFlipCardTopArtistsStateEncapsulation["reportProperties"]
  ) {
    return reportProperties.data.report.artists;
  }
}
