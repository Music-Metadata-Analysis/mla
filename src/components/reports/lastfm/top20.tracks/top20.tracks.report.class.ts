import FlipCardDrawerContainer from "@src/components/reports/lastfm/common/drawer/flip.card/flip.card.report.drawer.container";
import FlipCardBaseReport from "@src/components/reports/lastfm/common/report.class/flip.card.report.base.class";
import routes from "@src/config/routes";
import UserTrackDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.track.flipcard.report.class";
import type { LastFMTopTracksReportResponseInterface } from "@src/web/api/lastfm/types/lastfm/response.types";

export default class Top20TracksReport extends FlipCardBaseReport<
  UserTrackDataState,
  LastFMTopTracksReportResponseInterface["tracks"]
> {
  protected analyticsReportType = "TOP20 TRACKS" as const;
  protected drawerArtWorkAltTextTranslationKey =
    "top20Tracks.drawer.artWorkAltText";
  protected drawerComponent = FlipCardDrawerContainer;
  protected encapsulationClass = UserTrackDataState;
  protected hookMethod = "top20tracks" as const;
  protected retryRoute = routes.search.lastfm.top20tracks;
  protected translationKey = "top20Tracks" as const;

  getNumberOfImageLoads = (
    userProperties: UserTrackDataState["userProperties"]
  ) => {
    return this.getReportData(userProperties).length * 2;
  };

  getReportData(userProperties: UserTrackDataState["userProperties"]) {
    return userProperties.data.report.tracks;
  }
}
