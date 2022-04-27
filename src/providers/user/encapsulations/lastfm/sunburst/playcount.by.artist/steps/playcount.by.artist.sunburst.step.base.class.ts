import type { LastFMClientParamsInterface } from "../../../../../../../types/clients/api/lastfm/request.types";
import type { StepInterface } from "../../../../../../../types/clients/api/lastfm/sunburst.types";
import type UserPlaycountByArtistState from "../user.state.playcount.by.artist.sunburst.report.class";

abstract class PlayCountByArtistStepBase implements StepInterface {
  state: UserPlaycountByArtistState;
  params: LastFMClientParamsInterface;

  constructor(
    state: UserPlaycountByArtistState,
    params: LastFMClientParamsInterface
  ) {
    this.state = state;
    this.params = params;
  }
  abstract getStep(): void;
}

export default PlayCountByArtistStepBase;
