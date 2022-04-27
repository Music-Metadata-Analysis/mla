import EventDefinition from "../../../../../../events/event.class";
import LastFMBaseClient from "../../../lastfm.api.client.base.class";
import type UserSunBurstReportBaseState from "../../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { EventCreatorType } from "../../../../../../types/analytics.types";
import type { LastFMReportParamsInterface } from "../../../../../../types/clients/api/lastfm/request.types";
import type { userDispatchType } from "../../../../../../types/user/context.types";
abstract class LastFMBaseSunBurstDataPointClient<
  ReportType,
  ResponseType
> extends LastFMBaseClient<ResponseType> {
  private encapsulatedState: UserSunBurstReportBaseState<ReportType>;

  constructor(
    dispatch: userDispatchType,
    event: EventCreatorType,
    encapsulatedState: UserSunBurstReportBaseState<ReportType>
  ) {
    super(dispatch, event);
    this.encapsulatedState = encapsulatedState;
  }

  private isComplete() {
    return this.encapsulatedState.getReportStatus().complete;
  }

  private getDispatchState() {
    return this.encapsulatedState.getDispatchState();
  }

  private updateReport(params: LastFMReportParamsInterface) {
    this.encapsulatedState.updateWithResponse(
      this.response.response,
      params,
      this.route
    );
  }

  handleSuccessful(params: LastFMReportParamsInterface): void {
    if (this.response.status === 200) {
      this.updateReport(params);
      if (this.isComplete()) {
        this.dispatch({
          type: "SuccessFetchUser",
          userName: params.userName,
          data: this.getDispatchState(),
          integration: this.integration,
        });
        this.eventDispatch(
          new EventDefinition({
            category: "LAST.FM",
            label: "RESPONSE",
            action: `${this.eventType}: RECEIVED RESPONSE FROM LAST.FM.`,
          })
        );
      } else {
        this.dispatch({
          type: "PartialFetchUser",
          userName: params.userName,
          data: this.getDispatchState(),
          integration: this.integration,
        });
      }
    }
  }
}

export default LastFMBaseSunBurstDataPointClient;
