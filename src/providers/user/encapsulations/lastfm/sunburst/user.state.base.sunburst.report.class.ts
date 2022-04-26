import UserBaseState from "../user.state.base.class";
import type { AggregateBaseReportResponseInterface } from "../../../../../types/integrations/base.types";
import type { LastFMUserStateBase } from "../../../../../types/user/state.types";

export default abstract class UserSunBurstReportBaseState<
  ReportType
> extends UserBaseState {
  lastfmPrefix = "https://last.fm/music";

  constructor(userProperties: LastFMUserStateBase) {
    super(userProperties);
  }

  getReportContent = () => this.getReport().content;

  getReportStatus = () => this.getReport().status;

  getDispatchState = () => this.userProperties.data.report;

  abstract updateWithResponse(response: unknown, url: string): void;

  abstract getReport(): AggregateBaseReportResponseInterface<ReportType>;
}
