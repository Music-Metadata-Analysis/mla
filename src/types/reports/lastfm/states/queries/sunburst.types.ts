import type LastFMSunburstDataClient from "@src/clients/api/lastfm/data/sunburst/sunburst.client.base.class";
import type { BillBoardProgressBarDetails } from "@src/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import type SunBurstBaseNodeEncapsulation from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type UserSunBurstReportBaseState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type ReportBaseState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type {
  d3Node,
  SunBurstData,
} from "@src/types/reports/generics/sunburst.types";
import type { LastFMReportStateQueryInterface } from "@src/types/reports/lastfm/states/queries/base.types";
import type { userDispatchType } from "@src/types/user/context.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";

export type SunBurstReportStateQueryConstructor<AggregateReportType> = new (
  dispatch: userDispatchType,
  eventCreator: EventCreatorType,
  encapsulatedState: UserSunBurstReportBaseState<AggregateReportType>
) => LastFMSunburstDataClient<AggregateReportType>;

export type SunBurstReportStateEncapsulationConstructor<AggregateReportType> =
  new (
    state: LastFMUserStateBase
  ) => UserSunBurstReportBaseState<AggregateReportType>;

export interface SunBurstReportStateQueryInterface<
  ReportState extends ReportBaseState,
  CompletedReportDataType,
  DrawerComponentProps
> extends LastFMReportStateQueryInterface<
    ReportState,
    CompletedReportDataType,
    DrawerComponentProps
  > {
  getEncapsulatedNode(node: d3Node): SunBurstBaseNodeEncapsulation;

  getEntities(): Array<SunBurstData["entity"]>;

  getEntityLeaf(): SunBurstData["entity"];

  getEntityTopLevel(): SunBurstData["entity"];

  getProgressPercentage(
    reportProperties: ReportState["userProperties"]
  ): number;

  getProgressDetails(
    reportProperties: ReportState["userProperties"],
    t: tFunctionType
  ): BillBoardProgressBarDetails;

  getSunBurstData(
    reportProperties: ReportState["userProperties"],
    rootTag: string,
    remainderTag: string
  ): SunBurstData;

  queryIsResumable(reportProperties: ReportState["userProperties"]): boolean;
}
