import FlipCardDrawer from "@src/components/reports/lastfm/common/flip.card.report.drawer/flip.card.report.drawer.component";
import FlipCardBaseReport from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.base.class";
import routes from "@src/config/routes";
import UserArtistDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.artist.flipcard.report.class";

export default class Top20AlbumsReport extends FlipCardBaseReport<UserArtistDataState> {
  analyticsReportType = "TOP20 ARTISTS" as const;
  drawerArtWorkAltText = "top20Artists.drawer.artWorkAltText";
  drawerComponent = FlipCardDrawer;
  encapsulationClass = UserArtistDataState;
  retryRoute = routes.search.lastfm.top20artists;
  translationKey = "top20Artists" as const;
  hookMethod = "top20artists" as const;

  getNumberOfImageLoads = (
    userProperties: UserArtistDataState["userProperties"]
  ) => {
    return this.getReportData(userProperties).length * 2;
  };

  getReportData(userProperties: UserArtistDataState["userProperties"]) {
    return userProperties.data.report.artists;
  }
}
