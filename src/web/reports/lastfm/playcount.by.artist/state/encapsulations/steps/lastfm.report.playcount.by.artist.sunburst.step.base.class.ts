import type LastFMReportPlayCountByArtistStateEncapsulation from "../lastfm.report.encapsulation.playcount.by.artist.class";
import type { LastFMReportClientParamsInterface } from "@src/contracts/api/types/clients/lastfm.client.types";
import type { StepInterface } from "@src/web/reports/generics/types/state/encapsulations/aggregate.report.encapsulation.types";

abstract class PlayCountByArtistStepBase implements StepInterface {
  state: LastFMReportPlayCountByArtistStateEncapsulation;
  params: LastFMReportClientParamsInterface;

  constructor(
    state: LastFMReportPlayCountByArtistStateEncapsulation,
    params: LastFMReportClientParamsInterface
  ) {
    this.state = state;
    this.params = params;
  }
  abstract getStep(): void;
}

export default PlayCountByArtistStepBase;
