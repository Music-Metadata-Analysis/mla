import type ReportBaseState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { userDispatchType } from "@src/types/user/context.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type LastFMReportBaseClient from "@src/web/api/lastfm/lastfm.api.client.base.class";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";

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
