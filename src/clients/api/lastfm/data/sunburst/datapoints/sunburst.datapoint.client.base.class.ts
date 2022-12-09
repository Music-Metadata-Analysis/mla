import LastFMBaseClient from "@src/clients/api/lastfm/lastfm.api.client.base.class";
import type UserSunBurstReportBaseState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { EventCreatorType } from "@src/types/analytics.types";
import type { LastFMReportParamsInterface } from "@src/types/clients/api/lastfm/request.types";
import type { userDispatchType } from "@src/types/user/context.types";
abstract class LastFMBaseSunBurstDataPointClient<
  ReportType,
  ResponseType
> extends LastFMBaseClient<ResponseType> {
  protected encapsulatedState: UserSunBurstReportBaseState<ReportType>;

  constructor(
    dispatch: userDispatchType,
    event: EventCreatorType,
    encapsulatedState: UserSunBurstReportBaseState<ReportType>
  ) {
    super(dispatch, event);
    this.encapsulatedState = encapsulatedState;
  }

  protected isComplete() {
    return this.encapsulatedState.getReportStatus().complete;
  }

  protected getDispatchState() {
    return this.encapsulatedState.getDispatchState();
  }

  protected updateReport(params: LastFMReportParamsInterface) {
    this.encapsulatedState.updateWithResponse(
      this.response.response,
      params,
      this.route
    );
  }

  protected isInitialParams(params: LastFMReportParamsInterface) {
    return (
      JSON.stringify(params) === JSON.stringify({ userName: params.userName })
    );
  }

  protected handleBegin(params: LastFMReportParamsInterface): void {
    if (this.isInitialParams(params)) {
      this.dispatch({
        type: "StartFetch",
        userName: params.userName,
        integration: this.integration,
      });
    } else {
      this.dispatch({
        type: "DataPointStartFetch",
      });
    }
  }

  protected handleFailure(params: LastFMReportParamsInterface) {
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

  protected handleNotFound(params: LastFMReportParamsInterface): void {
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

  protected handleTimeout(params: LastFMReportParamsInterface): void {
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

  protected handleSuccessful(params: LastFMReportParamsInterface): void {
    if (this.response.status === 200) {
      this.updateReport(params);
      if (this.isComplete()) {
        this.dispatch({
          type: "SuccessFetch",
          userName: params.userName,
          data: this.getDispatchState(),
          integration: this.integration,
        });
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
