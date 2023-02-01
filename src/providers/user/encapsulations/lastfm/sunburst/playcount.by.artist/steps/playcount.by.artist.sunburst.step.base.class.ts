import type PlayCountByArtistState from "../user.state.playcount.by.artist.sunburst.report.class";
import type { LastFMReportClientParamsInterface } from "@src/web/api/lastfm/types/report.client.types";
import type { StepInterface } from "@src/web/reports/generics/types/state/aggregate.report.types";

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
