import EventDefinition from "../../../../../events/event.class";
import LastFMBaseClient from "../../lastfm.api.client.base.class";
import type UserSunBurstReportBaseState from "../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { EventCreatorType } from "../../../../../types/analytics.types";
import type { userDispatchType } from "../../../../../types/user/context.types";

abstract class LastFMBaseSunBurstDataClient<
  ReportType
> extends LastFMBaseClient<ReportType> {
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

  private updateReport() {
    this.encapsulatedState.updateWithResponse(
      this.response.response,
      this.route
    );
  }

  handleSuccessful(userName: string): void {
    if (this.response.status === 200) {
      this.updateReport();
      if (this.isComplete()) {
        this.dispatch({
          type: "SuccessFetchUser",
          userName,
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
          userName,
          data: this.getDispatchState(),
          integration: this.integration,
        });
      }
    }
  }
}

export default LastFMBaseSunBurstDataClient;
