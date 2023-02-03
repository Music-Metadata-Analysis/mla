import routes from "@src/config/routes";
import UserTrackDataState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/flipcard/user.state.track.flipcard.report.class";
import FlipCardDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/flip.card/flip.card.report.drawer.container";
import FlipCardBaseReport from "@src/web/reports/lastfm/generics/state/queries/flip.card.query.base.class";
import type { LastFMTopTracksReportResponseInterface } from "@src/web/api/lastfm/types/response.types";

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
