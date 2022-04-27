import type UserSunBurstReportBaseState from "../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { EventCreatorType } from "../../../../../types/analytics.types";
import type { LastFMReportParamsInterface } from "../../../../../types/clients/api/lastfm/request.types";
import type { SunBurstDataPointClientConstructor } from "../../../../../types/clients/api/lastfm/sunburst.types";
import type { userDispatchType } from "../../../../../types/user/context.types";

abstract class LastFMSunburstDataClient<AggregateReportType> {
  dispatch: userDispatchType;
  eventDispatch: EventCreatorType;
  encapsulatedState: UserSunBurstReportBaseState<AggregateReportType>;
  abstract dataPointClasses: Array<
    SunBurstDataPointClientConstructor<AggregateReportType>
  >;
  abstract defaultRoute: string;
  retries = 3;

  constructor(
    dispatch: userDispatchType,
    event: EventCreatorType,
    encapsulatedState: UserSunBurstReportBaseState<AggregateReportType>
  ) {
    this.dispatch = dispatch;
    this.eventDispatch = event;
    this.encapsulatedState = encapsulatedState;
  }

  private getRoute() {
    let route = this.defaultRoute;
    if (this.encapsulatedState.getReportStatus()?.operation?.url) {
      route = this.encapsulatedState.getReportStatus()?.operation
        ?.url as string;
    }
    return route;
  }

  private getParams(params: LastFMReportParamsInterface) {
    if (this.encapsulatedState.getReportStatus()?.operation?.params) {
      return this.encapsulatedState.getReportStatus()?.operation
        ?.params as LastFMReportParamsInterface;
    }
    return params;
  }

  retrieveReport(params: LastFMReportParamsInterface): void {
    const route = this.getRoute();
    const dataPointInstances = this.dataPointClasses.map(
      (dataPointClass) =>
        new dataPointClass(
          this.dispatch,
          this.eventDispatch,
          this.encapsulatedState
        )
    );
    const instance = dataPointInstances.find(
      (instance) => instance.route === route
    );
    if (instance) {
      instance.retrieveReport(this.getParams(params));
    } else {
      this.encapsulatedState.throwError();
    }
  }
}

export default LastFMSunburstDataClient;
