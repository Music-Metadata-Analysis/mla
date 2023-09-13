import routes from "@src/config/routes";
import FlipCardDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/flip.card/flip.card.report.drawer.container";
import FlipCardAbstractBaseQuery from "@src/web/reports/lastfm/generics/state/queries/flip.card.query.base.class";
import LastFMReportFlipCardTopAlbumsStateEncapsulation from "@src/web/reports/lastfm/top20.albums/state/encapsulations/lastfm.report.encapsulation.top.albums.flipcard.class";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";

export default class Top20AlbumsQuery extends FlipCardAbstractBaseQuery<
  LastFMReportFlipCardTopAlbumsStateEncapsulation,
  LastFMTopAlbumsReportResponseInterface["albums"]
> {
  protected analyticsReportType = "TOP20 ALBUMS" as const;
  protected drawerArtWorkAltTextTranslationKey =
    "top20Albums.drawer.artWorkAltText";
  protected drawerComponent = FlipCardDrawerContainer;
  protected hookMethod = "top20albums" as const;
  protected encapsulationClass =
    LastFMReportFlipCardTopAlbumsStateEncapsulation;
  protected translationKey = "top20Albums" as const;
  protected retryRoute = routes.search.lastfm.top20albums;

  getNumberOfImageLoads = (
    reportProperties: LastFMReportFlipCardTopAlbumsStateEncapsulation["reportProperties"]
  ) => {
    return this.getReportData(reportProperties).length * 2;
  };

  getReportData(
    reportProperties: LastFMReportFlipCardTopAlbumsStateEncapsulation["reportProperties"]
  ) {
    return reportProperties.data.report.albums;
  }
}
