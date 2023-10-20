import LastFMReportBaseStateEncapsulation from "./bases/lastfm.report.encapsulation.base.class";
import type { LastFMReportClientParamsInterface } from "@src/contracts/api/types/clients/lastfm.client.types";
import type { LastFMAggregateReportResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

export default abstract class LastFMReportSunBurstBaseStateEncapsulation<
  ReportType
> extends LastFMReportBaseStateEncapsulation {
  lastfmPrefix = "https://last.fm/music";
  abstract errorMessage: string;

  constructor(reportProperties: LastFMReportStateBase) {
    super(reportProperties);
  }

  abstract getReport(): LastFMAggregateReportResponseInterface<ReportType>;

  abstract updateWithResponse(
    response: unknown,
    params: LastFMReportClientParamsInterface,
    url: string
  ): void;

  abstract getNextStep(params: LastFMReportClientParamsInterface): void;

  abstract removeEntity(params: LastFMReportClientParamsInterface): void;

  throwError() {
    throw new Error(this.errorMessage);
  }

  getReportContent() {
    return this.getReport().content;
  }

  getReportStatus() {
    return this.getReport().status;
  }

  getDispatchState() {
    return this.reportProperties.data.report;
  }
}
