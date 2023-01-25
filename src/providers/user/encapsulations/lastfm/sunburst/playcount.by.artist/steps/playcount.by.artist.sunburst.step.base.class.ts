import type PlayCountByArtistState from "../user.state.playcount.by.artist.sunburst.report.class";
import type { StepInterface } from "@src/types/reports/generics/aggregate.types";
import type { LastFMReportClientParamsInterface } from "@src/web/api/lastfm/types/lastfm/report.client.types";

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
