import routes from "../../../../config/routes";
import UserAlbumDataState from "../../../../providers/user/encapsulations/lastfm/user.state.album.class";
import FlipCardDrawer from "../common/flip.card.report.drawer/flip.card.report.drawer.component";
import FlipCardBaseReport from "../common/flip.card.report/flip.card.report.base.class";

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
