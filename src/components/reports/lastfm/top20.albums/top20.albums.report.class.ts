import FlipCardDrawerContainer from "@src/components/reports/lastfm/common/drawer/flip.card/flip.card.report.drawer.container";
import FlipCardBaseReport from "@src/components/reports/lastfm/common/report.class/flip.card.report.base.class";
import routes from "@src/config/routes";
import UserAlbumDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/web/api/lastfm/types/lastfm/response.types";

export default class Top20AlbumsReport extends FlipCardBaseReport<
  UserAlbumDataState,
  LastFMTopAlbumsReportResponseInterface["albums"]
> {
  protected analyticsReportType = "TOP20 ALBUMS" as const;
  protected drawerArtWorkAltTextTranslationKey =
    "top20Albums.drawer.artWorkAltText";
  protected drawerComponent = FlipCardDrawerContainer;
  protected hookMethod = "top20albums" as const;
  protected encapsulationClass = UserAlbumDataState;
  protected translationKey = "top20Albums" as const;
  protected retryRoute = routes.search.lastfm.top20albums;

  getNumberOfImageLoads = (
    userProperties: UserAlbumDataState["userProperties"]
  ) => {
    return this.getReportData(userProperties).length * 2;
  };

  getReportData(userProperties: UserAlbumDataState["userProperties"]) {
    return userProperties.data.report.albums;
  }
}
