import FlipCardDrawer from "@src/components/reports/lastfm/common/flip.card.report.drawer/flip.card.report.drawer.component";
import FlipCardBaseReport from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.base.class";
import routes from "@src/config/routes";
import UserAlbumDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";

export default class Top20AlbumsReport extends FlipCardBaseReport<UserAlbumDataState> {
  analyticsReportType = "TOP20 ALBUMS" as const;
  drawerArtWorkAltText = "top20Albums.drawer.artWorkAltText";
  drawerComponent = FlipCardDrawer;
  encapsulationClass = UserAlbumDataState;
  translationKey = "top20Albums" as const;
  retryRoute = routes.search.lastfm.top20albums;
  hookMethod = "top20albums" as const;

  getNumberOfImageLoads = (
    userProperties: UserAlbumDataState["userProperties"]
  ) => {
    return this.getReportData(userProperties).length * 2;
  };

  getReportData(userProperties: UserAlbumDataState["userProperties"]) {
    return userProperties.data.report.albums;
  }
}
