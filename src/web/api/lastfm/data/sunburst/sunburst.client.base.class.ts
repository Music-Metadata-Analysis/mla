import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import type { userDispatchType } from "@src/types/user/context.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type { IntegrationRequestType } from "@src/web/analytics/collection/types/analytics.types";
import type { SunBurstDataPointClientConstructor } from "@src/web/api/lastfm/types/data.point.client.types";
import type {
  LastFMReportClientInterface,
  LastFMReportClientParamsInterface,
} from "@src/web/api/lastfm/types/report.client.types";
import type UserSunBurstReportBaseState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";

abstract class LastFMSunburstDataClient<AggregateReportType>
  implements LastFMReportClientInterface
{
  protected dispatch: userDispatchType;
  protected eventDispatch: EventCreatorType;
  abstract eventType: IntegrationRequestType;

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

  retrieveReport(params: LastFMReportClientParamsInterface): void {
    const route = this.getRoute();
    if (route === this.defaultRoute) {
      this.emitInitialAnalyticsEvent();
    }
    const dataPointInstances = this.getDataPointInstances();
    const instance = dataPointInstances.find(
      (instance) => instance.getRoute() === route
    );
    if (instance) {
      instance.retrieveReport(this.getParams(params));
    } else {
      this.encapsulatedState.throwError();
    }
  }

  protected emitInitialAnalyticsEvent() {
    this.eventDispatch(
      new analyticsVendor.EventDefinition({
        category: "LAST.FM",
        label: "AGGREGATE REQUESTS",
        action: `${this.eventType}: AGGREGATE REQUESTS BEING SENT TO LAST.FM.`,
      })
    );
  }

  protected getDataPointInstances() {
    return this.dataPointClasses.map(
      (dataPointClass) =>
        new dataPointClass(
          this.dispatch,
          this.eventDispatch,
          this.encapsulatedState
        )
    );
  }

  protected getParams(params: LastFMReportClientParamsInterface) {
    if (this.encapsulatedState.getReportStatus()?.operation?.params) {
      return this.encapsulatedState.getReportStatus()?.operation
        ?.params as LastFMReportClientParamsInterface;
    }
    return params;
  }
}

export default LastFMSunburstDataClient;
