import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type LastFMReportBaseClient from "@src/web/api/lastfm/clients/bases/lastfm.api.client.base.class";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type LastFMReportBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/bases/lastfm.report.encapsulation.base.class";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";

export type FlipCardReportStateQueryConstructor = new (
  dispatch: reportDispatchType,
  eventCreator: EventCreatorType
) => LastFMReportBaseClient<unknown>;

export interface FlipCardReportStateQueryInterface<
  ReportEncapsulation extends LastFMReportBaseStateEncapsulation,
  CompletedReportDataType,
  DrawerComponentProps,
> extends LastFMReportStateQueryInterface<
    ReportEncapsulation,
    CompletedReportDataType,
    DrawerComponentProps
  > {
  getDrawerArtWorkAltTextTranslationKey(): string;
  getNumberOfImageLoads(
    reportProperties: ReportEncapsulation["reportProperties"]
  ): number;
}
