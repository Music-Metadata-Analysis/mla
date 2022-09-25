import FlipCardDrawer from "@src/components/reports/lastfm/common/flip.card.report.drawer/flip.card.report.drawer.component";
import FlipCardBaseReport from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.base.class";
import routes from "@src/config/routes";
import UserTrackDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.track.flipcard.report.class";

export default class Top20TracksReport extends FlipCardBaseReport<UserTrackDataState> {
  analyticsReportType = "TOP20 TRACKS" as const;
  drawerArtWorkAltText = "top20Tracks.drawer.artWorkAltText";
  drawerComponent = FlipCardDrawer;
  encapsulationClass = UserTrackDataState;
  retryRoute = routes.search.lastfm.top20tracks;
  translationKey = "top20Tracks" as const;
  hookMethod = "top20tracks" as const;

  getNumberOfImageLoads = (
    userProperties: UserTrackDataState["userProperties"]
  ) => {
    return this.getReportData(userProperties).length * 2;
  };

  getReportData(userProperties: UserTrackDataState["userProperties"]) {
    return userProperties.data.report.tracks;
  }
}
