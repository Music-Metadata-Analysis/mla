import routes from "../../../../config/routes";
import UserTrackDataState from "../../../../providers/user/encapsulations/lastfm/user.state.track.class";
import FlipCardDrawer from "../common/flip.card.report.drawer/flip.card.report.drawer.component";
import FlipCardBaseReport from "../common/flip.card.report/flip.card.report.base.class";

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
