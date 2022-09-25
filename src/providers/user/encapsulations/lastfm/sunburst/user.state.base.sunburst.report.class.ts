import UserBaseState from "../user.state.base.class";
import type { LastFMClientParamsInterface } from "@src/types/clients/api/lastfm/request.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/integrations/base.types";
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
    params: LastFMClientParamsInterface,
    url: string
  ): void;

  abstract getNextStep(params: LastFMClientParamsInterface): void;

  abstract removeEntity(params: LastFMClientParamsInterface): void;

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
