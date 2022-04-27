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

  private isInitialParams(params: LastFMReportParamsInterface) {
    return (
      JSON.stringify(params) === JSON.stringify({ userName: params.userName })
    );
  }

  handleBegin(params: LastFMReportParamsInterface): void {
    if (this.isInitialParams(params)) {
      super.handleBegin(params);
    } else {
      this.dispatch({
        type: "DataPointStartFetch",
      });
    }
  }

  handleFailure(params: LastFMReportParamsInterface) {
    if (this.isInitialParams(params)) {
      super.handleFailure(params);
    } else {
      // There may have been a problem updating the entity, so remove it completely as a fall back.
      this.encapsulatedState.removeEntity(params);
      this.dispatch({
        type: "DataPointFailureFetch",
        data: this.getDispatchState(),
      });
    }
  }

  handleNotFound(params: LastFMReportParamsInterface): void {
    if (this.response.status === 404) {
      if (this.isInitialParams(params)) {
        super.handleNotFound(params);
      } else {
        // There may have been a problem updating the entity, so remove it completely as a fall back.
        this.encapsulatedState.removeEntity(params);
        this.dispatch({
          type: "DataPointNotFoundFetch",
          data: this.getDispatchState(),
        });
      }
    }
  }

  handleTimeout(params: LastFMReportParamsInterface): void {
    if (this.response.status === 503) {
      const backOff = parseInt(this.response?.headers["retry-after"]);
      if (!isNaN(backOff)) {
        setTimeout(() => {
          this.dispatch({
            type: "DataPointTimeoutFetch",
          });
        }, backOff * 1000);
      } else {
        super.handleFailure(params);
      }
    }
  }

  handleSuccessful(params: LastFMReportParamsInterface): void {
    if (this.response.status === 200) {
      this.updateReport(params);
      if (this.isComplete()) {
        this.dispatch({
          type: "SuccessFetch",
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
          type: "DataPointSuccessFetch",
          data: this.getDispatchState(),
        });
      }
    }
  }
}

export default LastFMBaseSunBurstDataPointClient;
