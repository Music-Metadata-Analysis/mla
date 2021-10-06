import AlbumDrawer from "./drawer.album/drawer.album.component";
import routes from "../../../../config/routes";
import UserAlbumDataState from "../../../../providers/user/encapsulations/user.state.album.class";
import LastFMBaseReport from "../common/flip.card.report/flip.card.report.base.class";
import type { userHookAsLastFMTop20AlbumReport } from "../../../../types/user/hook.types";

export default class Top20AlbumsReport extends LastFMBaseReport<UserAlbumDataState> {
  analyticsReportType = "TOP20 ALBUMS" as const;
  drawerComponent = AlbumDrawer;
  encapsulationClass = UserAlbumDataState;
  retryRoute = routes.search.lastfm.top20albums;
  translationKey = "top20Albums" as const;

  getNumberOfImageLoads = (
    userProperties: UserAlbumDataState["userProperties"]
  ) => {
    return this.getReportData(userProperties).length * 2;
  };

  getReportData(userProperties: UserAlbumDataState["userProperties"]) {
    return userProperties.data.report.albums;
  }

  startDataFetch(user: userHookAsLastFMTop20AlbumReport, userName: string) {
    user.top20albums(userName);
  }
}
