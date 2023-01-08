import type LastFMReportBaseClient from "@src/clients/api/lastfm/lastfm.api.client.base.class";
import type ReportBaseState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { EventCreatorType } from "@src/types/analytics.types";
import type { LastFMReportStateQueryInterface } from "@src/types/reports/lastfm/states/queries/base.types";
import type { userDispatchType } from "@src/types/user/context.types";

export type FlipCardReportStateQueryConstructor = new (
  dispatch: userDispatchType,
  eventCreator: EventCreatorType
) => LastFMReportBaseClient<unknown>;

export interface FlipCardReportStateQueryInterface<
  ReportState extends ReportBaseState,
  CompletedReportDataType,
  DrawerComponentProps
> extends LastFMReportStateQueryInterface<
    ReportState,
    CompletedReportDataType,
    DrawerComponentProps
  > {
  getDrawerArtWorkAltTextTranslationKey(): string;
  getNumberOfImageLoads(
    reportProperties: ReportState["userProperties"]
  ): number;
}
