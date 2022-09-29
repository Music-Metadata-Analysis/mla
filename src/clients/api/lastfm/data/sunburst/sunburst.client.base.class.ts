import type UserSunBurstReportBaseState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { EventCreatorType } from "@src/types/analytics.types";
import type {
  LastFMReportInterface,
  LastFMReportParamsInterface,
} from "@src/types/clients/api/lastfm/request.types";
import type { SunBurstDataPointClientConstructor } from "@src/types/clients/api/lastfm/sunburst.types";
import type { userDispatchType } from "@src/types/user/context.types";

abstract class LastFMSunburstDataClient<AggregateReportType>
  implements LastFMReportInterface
{
  protected dispatch: userDispatchType;
  protected eventDispatch: EventCreatorType;
  protected encapsulatedState: UserSunBurstReportBaseState<AggregateReportType>;
  protected abstract dataPointClasses: Array<
    SunBurstDataPointClientConstructor<AggregateReportType>
  >;
  protected abstract defaultRoute: string;
  protected retries = 3;

  constructor(
    dispatch: userDispatchType,
    event: EventCreatorType,
    encapsulatedState: UserSunBurstReportBaseState<AggregateReportType>
  ) {
    this.dispatch = dispatch;
    this.eventDispatch = event;
    this.encapsulatedState = encapsulatedState;
  }

  getRoute() {
    let route = this.defaultRoute;
    if (this.encapsulatedState.getReportStatus()?.operation?.url) {
      route = this.encapsulatedState.getReportStatus()?.operation
        ?.url as string;
    }
    return route;
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
      (instance) => instance.getRoute() === route
    );
    if (instance) {
      instance.retrieveReport(this.getParams(params));
    } else {
      this.encapsulatedState.throwError();
    }
  }

  protected getParams(params: LastFMReportParamsInterface) {
    if (this.encapsulatedState.getReportStatus()?.operation?.params) {
      return this.encapsulatedState.getReportStatus()?.operation
        ?.params as LastFMReportParamsInterface;
    }
    return params;
  }
}

export default LastFMSunburstDataClient;
