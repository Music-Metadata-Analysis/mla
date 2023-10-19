import settings from "@src/config/lastfm";
import LastFMReportBaseClient from "@src/web/api/lastfm/clients/bases/lastfm.api.client.base.class";
import type { LastFMReportClientParamsInterface } from "@src/contracts/api/types/clients/lastfm.client.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type LastFMReportSunBurstBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";

abstract class LastFMBaseSunBurstDataPointClient<
  ReportType,
  ResponseType
> extends LastFMReportBaseClient<ResponseType> {
  protected encapsulatedState: LastFMReportSunBurstBaseStateEncapsulation<ReportType>;

  constructor(
    dispatch: reportDispatchType,
    event: EventCreatorType,
    encapsulatedState: LastFMReportSunBurstBaseStateEncapsulation<ReportType>
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

  protected updateReport(params: LastFMReportClientParamsInterface) {
    this.encapsulatedState.updateWithResponse(
      this.response.response,
      params,
      this.route
    );
  }

  protected isInitialParams(params: LastFMReportClientParamsInterface) {
    return (
      JSON.stringify(params) === JSON.stringify({ userName: params.userName })
    );
  }

  protected handleBegin(params: LastFMReportClientParamsInterface): void {
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

  protected handleFailure(params: LastFMReportClientParamsInterface) {
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

  protected handleNotFound(params: LastFMReportClientParamsInterface): void {
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

  protected handleTimeout(params: LastFMReportClientParamsInterface): void {
    if (this.response.status === 503) {
      const backOff = parseInt(this.response.headers["retry-after"]);
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

  protected handleSuccessful(params: LastFMReportClientParamsInterface): void {
    if (this.response.ok) {
      this.updateReport(params);
      if (this.isComplete()) {
        this.dispatch({
          type: "SuccessFetch",
          userName: params.userName,
          data: this.getDispatchState(),
          integration: this.integration,
          userProfile: `${settings.homePage}/user/${params.userName}`,
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
