import UserBaseState from "../user.state.base.class";
import type { LastFMReportClientParamsInterface } from "@src/types/clients/api/lastfm/report.client.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/reports/generics/aggregate.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

abstract class UserSunBurstReportBaseState<ReportType> extends UserBaseState {
  lastfmPrefix = "https://last.fm/music";
  abstract errorMessage: string;

  constructor(userProperties: LastFMUserStateBase) {
    super(userProperties);
  }

  abstract getReport(): AggregateBaseReportResponseInterface<ReportType>;

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
