import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type LastFMSunburstDataClient from "@src/web/api/lastfm/clients/bases/lastfm.api.sunburst.client.base.class";
import type {
  d3Node,
  SunBurstData,
} from "@src/web/reports/generics/types/charts/sunburst.types";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type SunBurstBaseNodeEncapsulation from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type LastFMReportBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/bases/lastfm.report.encapsulation.base.class";
import type LastFMReportSunBurstBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";
import type { BillBoardProgressBarDetails } from "@src/web/ui/generics/components/billboard/billboard.progress.bar/billboard.progress.bar.component";

export type SunBurstReportStateQueryConstructor<AggregateReportType> = new (
  dispatch: reportDispatchType,
  eventCreator: EventCreatorType,
  encapsulatedState: LastFMReportSunBurstBaseStateEncapsulation<AggregateReportType>
) => LastFMSunburstDataClient<AggregateReportType>;

export type SunBurstReportStateEncapsulationConstructor<AggregateReportType> =
  new (
    state: LastFMReportStateBase
  ) => LastFMReportSunBurstBaseStateEncapsulation<AggregateReportType>;

export interface SunBurstReportStateQueryInterface<
  ReportEncapsulation extends LastFMReportBaseStateEncapsulation,
  CompletedReportDataType,
  DrawerComponentProps
> extends LastFMReportStateQueryInterface<
    ReportEncapsulation,
    CompletedReportDataType,
    DrawerComponentProps
  > {
  getEncapsulatedNode(node: d3Node): SunBurstBaseNodeEncapsulation;

  getEntities(): Array<SunBurstData["entity"]>;

  getEntityLeaf(): SunBurstData["entity"];

  getEntityTopLevel(): SunBurstData["entity"];

  getProgressPercentage(
    reportProperties: ReportEncapsulation["reportProperties"]
  ): number;

  getProgressDetails(
    reportProperties: ReportEncapsulation["reportProperties"],
    t: tFunctionType
  ): BillBoardProgressBarDetails;

  getSunBurstData(
    reportProperties: ReportEncapsulation["reportProperties"],
    rootTag: string,
    remainderTag: string
  ): SunBurstData;

  queryIsResumable(
    reportProperties: ReportEncapsulation["reportProperties"]
  ): boolean;
}
