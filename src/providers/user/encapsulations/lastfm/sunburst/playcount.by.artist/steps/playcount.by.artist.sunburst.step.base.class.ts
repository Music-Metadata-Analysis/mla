import type { LastFMClientParamsInterface } from "../../../../../../../types/clients/api/reports/lastfm.client.types";
import type { StepInterface } from "../../../../../../../types/clients/api/reports/lastfm.sunburst.types";
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

  attachParamsToUrl(url: string, params: LastFMClientParamsInterface) {
    let updatedURL = url;
    for (const [key, value] of Object.entries(params)) {
      updatedURL = updatedURL.replace(
        `:${key.toLowerCase()}`,
        encodeURIComponent(value)
      );
    }
    if (!updatedURL.includes(params.userName)) {
      const searchUrl = new URL(this.state.lastfmPrefix + updatedURL);
      searchUrl.searchParams.set("username", params.userName);
      updatedURL = searchUrl.toString().replace(this.state.lastfmPrefix, "");
    }
    return updatedURL;
  }
}

export default PlayCountByArtistStepBase;
