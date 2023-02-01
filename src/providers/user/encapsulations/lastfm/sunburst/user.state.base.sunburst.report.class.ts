import UserBaseState from "../user.state.base.class";
import type { LastFMUserStateBase } from "@src/types/user/state.types";
import type { LastFMReportClientParamsInterface } from "@src/web/api/lastfm/types/report.client.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";

abstract class UserSunBurstReportBaseState<ReportType> extends UserBaseState {
  lastfmPrefix = "https://last.fm/music";
  abstract errorMessage: string;

  constructor(userProperties: LastFMUserStateBase) {
    super(userProperties);
  }

  abstract getReport(): LastFMAggregateReportResponseInterface<ReportType>;

  abstract updateWithResponse(
    response: unknown,
    params: LastFMReportClientParamsInterface,
    url: string
  ): void;

  abstract getNextStep(params: LastFMReportClientParamsInterface): void;

  abstract removeEntity(params: LastFMReportClientParamsInterface): void;

  throwError() {
    throw new Error(this.errorMessage);
  }

  getReportContent() {
    return this.getReport().content;
  }

  getReportStatus() {
    return this.getReport().status;
  }

  getDispatchState() {
    return this.userProperties.data.report;
  }
}

export default UserSunBurstReportBaseState;
