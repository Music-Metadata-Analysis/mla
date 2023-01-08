import type PlayCountByArtistState from "../user.state.playcount.by.artist.sunburst.report.class";
import type { LastFMReportClientParamsInterface } from "@src/types/clients/api/lastfm/report.client.types";
import type { StepInterface } from "@src/types/reports/generics/aggregate.types";

abstract class PlayCountByArtistStepBase implements StepInterface {
  state: PlayCountByArtistState;
  params: LastFMReportClientParamsInterface;

  constructor(
    state: PlayCountByArtistState,
    params: LastFMReportClientParamsInterface
  ) {
    this.state = state;
    this.params = params;
  }
  abstract getStep(): void;
}

export default PlayCountByArtistStepBase;
