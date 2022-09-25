import type PlayCountByArtistState from "../user.state.playcount.by.artist.sunburst.report.class";
import type { LastFMClientParamsInterface } from "@src/types/clients/api/lastfm/request.types";
import type { StepInterface } from "@src/types/clients/api/lastfm/sunburst.types";

abstract class PlayCountByArtistStepBase implements StepInterface {
  state: PlayCountByArtistState;
  params: LastFMClientParamsInterface;

  constructor(
    state: PlayCountByArtistState,
    params: LastFMClientParamsInterface
  ) {
    this.state = state;
    this.params = params;
  }
  abstract getStep(): void;
}

export default PlayCountByArtistStepBase;
