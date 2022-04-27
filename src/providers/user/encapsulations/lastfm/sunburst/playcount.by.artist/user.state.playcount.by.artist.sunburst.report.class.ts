import Step1 from "./steps/step.1.class";
import Step2 from "./steps/step.2.class";
import Step3 from "./steps/step.3.class";
import Transformation1 from "./transformations/transformation.1.class";
import Transformation2 from "./transformations/transformation.2.class";
import Transformation3 from "./transformations/transformation.3.class";
import Transformation4 from "./transformations/transformation.4.class";
import Transformation5 from "./transformations/transformation.5.class";
import apiRoutes from "../../../../../../config/apiRoutes";
import UserSunBurstReportBaseState from "../user.state.base.sunburst.report.class";
import type { LastFMClientParamsInterface } from "../../../../../../types/clients/api/lastfm/request.types";
import type { PlayCountByArtistReportInterface } from "../../../../../../types/clients/api/lastfm/response.types";
import type {
  AggregateBaseReportResponseInterface,
  AggregateReportOperationType,
} from "../../../../../../types/integrations/base.types";

export default class UserPlaycountByArtistState extends UserSunBurstReportBaseState<
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
    this.userProperties.data.report
      .playCountByArtist as AggregateBaseReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;

  updateWithResponse(
    response: unknown,
    params: LastFMClientParamsInterface,
    url: keyof UserPlaycountByArtistState["transformations"]
  ) {
    if (!this.transformations.hasOwnProperty(url)) this.throwError();

    const transformation = new this.transformations[url](
      this,
      params,
      response
    );
    transformation.transform();
  }

  removeEntity(params: LastFMClientParamsInterface): void {
    const transformation = new Transformation5(this, params, {});
    transformation.transform();
  }

  getNextStep(
    params: LastFMClientParamsInterface
  ): AggregateReportOperationType | undefined {
    for (const nextStep of this.sequence) {
      const operation = new nextStep(this, params).getStep();
      if (operation) return operation;
    }
    return undefined;
  }
}
