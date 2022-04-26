import UserSunBurstReportBaseState from "./user.state.base.sunburst.report.class";
import type { PlayCountByArtistReportInterface } from "../../../../../types/clients/api/reports/lastfm.client.types";
import type { LastFMUserStatePlayCountByArtistReport } from "../../../../../types/user/state.types";

export default class UserPlaycountByArtistState extends UserSunBurstReportBaseState<
  PlayCountByArtistReportInterface[]
> {
  userProperties!: LastFMUserStatePlayCountByArtistReport;

  updateWithResponse(response: unknown, url: string) {
    console.log(response, url);
  }

  getReport = () => this.userProperties.data.report.playCountByArtist;
}
