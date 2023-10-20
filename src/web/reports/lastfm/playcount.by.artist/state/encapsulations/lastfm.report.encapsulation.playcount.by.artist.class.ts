import Step1 from "./steps/step.1.class";
import Step2 from "./steps/step.2.class";
import Step3 from "./steps/step.3.class";
import Transformation1 from "./transformations/transformation.1.class";
import Transformation2 from "./transformations/transformation.2.class";
import Transformation3 from "./transformations/transformation.3.class";
import Transformation4 from "./transformations/transformation.4.class";
import Transformation5 from "./transformations/transformation.5.class";
import apiRoutes from "@src/config/apiRoutes";
import LastFMReportSunBurstBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";
import type { LastFMReportClientParamsInterface } from "@src/contracts/api/types/clients/lastfm.client.types";
import type {
  LastFMAggregateReportResponseInterface,
  LastFMAggregateReportOperationType,
} from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.playcount.by.artist.report.types";

export default class LastFMReportPlayCountByArtistStateEncapsulation extends LastFMReportSunBurstBaseStateEncapsulation<
  PlayCountByArtistReportInterface[]
> {
  private transformations = {
    DEFAULT: Transformation1,
    [apiRoutes.v2.reports.lastfm.top20artists]: Transformation2,
    [apiRoutes.v2.data.artists.albumsList]: Transformation3,
    [apiRoutes.v2.data.artists.albumsGet]: Transformation4,
  };
  private sequence = [Step1, Step2, Step3];
  errorMessage = "Error generating the PlayCount By Artist Report!";

  getReport = () =>
    this.reportProperties.data.report
      .playCountByArtist as LastFMAggregateReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;

  updateWithResponse(
    response: unknown,
    params: LastFMReportClientParamsInterface,
    url: keyof LastFMReportPlayCountByArtistStateEncapsulation["transformations"]
  ) {
    if (!this.transformations.hasOwnProperty(url)) this.throwError();

    const transformation = new this.transformations[url](
      this,
      params,
      response
    );
    transformation.transform();
  }

  removeEntity(params: LastFMReportClientParamsInterface): void {
    const transformation = new Transformation5(this, params, {});
    transformation.transform();
  }

  getNextStep(
    params: LastFMReportClientParamsInterface
  ): LastFMAggregateReportOperationType | undefined {
    for (const nextStep of this.sequence) {
      const operation = new nextStep(this, params).getStep();
      if (operation) return operation;
    }
    return undefined;
  }
}
