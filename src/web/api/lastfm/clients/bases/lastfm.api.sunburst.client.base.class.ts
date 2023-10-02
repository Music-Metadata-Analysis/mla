import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type { IntegrationRequestType } from "@src/web/analytics/collection/types/analytics.types";
import type {
  LastFMReportClientInterface,
  LastFMReportClientParamsInterface,
  LastFMSunBurstDataPointClientConstructor,
} from "@src/web/api/lastfm/types/lastfm.api.client.types";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type LastFMReportSunBurstBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";

abstract class LastFMSunburstDataClient<AggregateReportType>
  implements LastFMReportClientInterface
{
  protected dispatch: reportDispatchType;
  protected eventDispatch: EventCreatorType;
  abstract eventType: IntegrationRequestType;

  protected encapsulatedState: LastFMReportSunBurstBaseStateEncapsulation<AggregateReportType>;
  protected abstract dataPointClasses: Array<
    LastFMSunBurstDataPointClientConstructor<AggregateReportType>
  >;
  protected abstract defaultRoute: string;
  protected retries = 3;

  constructor(
    dispatch: reportDispatchType,
    event: EventCreatorType,
    encapsulatedState: LastFMReportSunBurstBaseStateEncapsulation<AggregateReportType>
  ) {
    this.dispatch = dispatch;
    this.eventDispatch = event;
    this.encapsulatedState = encapsulatedState;
  }

  getRoute() {
    let route = this.defaultRoute;
    const reportStatus = this.encapsulatedState.getReportStatus();
    if (reportStatus && reportStatus.operation) {
      route = reportStatus.operation.url;
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
    const reportStatus = this.encapsulatedState.getReportStatus();
    if (reportStatus && reportStatus.operation) {
      return reportStatus.operation.params;
    }
    return params;
  }
}

export default LastFMSunburstDataClient;
