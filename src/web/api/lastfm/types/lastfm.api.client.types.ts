import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type SunburstDataPointClient from "@src/web/api/lastfm/clients/bases/lastfm.api.sunburst.datapoint.client.base.class";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type LastFMReportSunBurstBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";

export interface LastFMReportClientInterface {
  getRoute(): string;
  retrieveReport: (params: LastFMReportClientParamsInterface) => void;
}

export interface LastFMReportClientParamsInterface {
  userName: string;
  artist?: string;
  album?: string;
  track?: string;
}

export type LastFMSunBurstDataPointClientConstructor<EncapsulationType> = {
  new (
    dispatch: reportDispatchType,
    event: EventCreatorType,
    encapsulatedState: LastFMReportSunBurstBaseStateEncapsulation<EncapsulationType>
  ): SunburstDataPointClient<EncapsulationType, unknown>;
};
