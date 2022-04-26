import StepBase from "./playcount.by.artist.sunburst.step.base.class";
import apiRoutes from "../../../../../../../config/apiRoutes";

class NextIsTopAlbums extends StepBase {
  getStep() {
    for (const artist of this.state.getReport().content) {
      if (artist.albums.length === 0)
        return {
          type: "Top Albums" as const,
          resource: artist.name,
          url: this.attachParamsToUrl(apiRoutes.v2.data.artists.albumsList, {
            artist: artist.name,
            userName: this.params.userName,
          }),
        };
    }
    return null;
  }
}

export default NextIsTopAlbums;
