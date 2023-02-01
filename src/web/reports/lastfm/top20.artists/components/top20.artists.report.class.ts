import routes from "@src/config/routes";
import UserArtistDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.artist.flipcard.report.class";
import FlipCardDrawerContainer from "@src/web/reports/lastfm/generics/components/drawer/flip.card/flip.card.report.drawer.container";
import FlipCardBaseReport from "@src/web/reports/lastfm/generics/components/report.class/flip.card.report.base.class";
import type { LastFMTopArtistsReportResponseInterface } from "@src/web/api/lastfm/types/response.types";

export default class Top20AlbumsReport extends FlipCardBaseReport<
  UserArtistDataState,
  LastFMTopArtistsReportResponseInterface["artists"]
> {
  protected analyticsReportType = "TOP20 ARTISTS" as const;
  protected drawerArtWorkAltTextTranslationKey =
    "top20Artists.drawer.artWorkAltText";
  protected drawerComponent = FlipCardDrawerContainer;
  protected encapsulationClass = UserArtistDataState;
  protected hookMethod = "top20artists" as const;
  protected retryRoute = routes.search.lastfm.top20artists;
  protected translationKey = "top20Artists" as const;

  getNumberOfImageLoads = (
    userProperties: UserArtistDataState["userProperties"]
  ) => {
    return this.getReportData(userProperties).length * 2;
  };

  getReportData(userProperties: UserArtistDataState["userProperties"]) {
    return userProperties.data.report.artists;
  }
}
