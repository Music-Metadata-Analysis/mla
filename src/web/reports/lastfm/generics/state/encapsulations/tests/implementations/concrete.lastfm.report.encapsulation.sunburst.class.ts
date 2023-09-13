import LastFMReportSunBurstBaseStateEncapsulation from "../../lastfm.report.encapsulation.sunburst.base.class";
import type { LastFMReportClientParamsInterface } from "@src/web/api/lastfm/types/lastfm.api.client.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/lastfm.aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.by.artist/types/state/aggregate.report.types";

export default class ConcreteLastFMReportSunBurstStateEncapsulation extends LastFMReportSunBurstBaseStateEncapsulation<
  PlayCountByArtistReportInterface[]
> {
  errorMessage = "Error Message";

  updateWithResponse(
    response: unknown,
    params: LastFMReportClientParamsInterface,
    url: string
  ) {
    mockUpdate(response, url, params);
  }

  getReport() {
    return this.reportProperties.data.report
      .playCountByArtist as LastFMAggregateReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;
  }

  getNextStep(params: LastFMReportClientParamsInterface): void {
    mockNextStep(params);
  }

  removeEntity(params: LastFMReportClientParamsInterface): void {
    mockRemove(params);
  }
}

export const mockNextStep = jest.fn();
export const mockRemove = jest.fn();
export const mockUpdate = jest.fn();
